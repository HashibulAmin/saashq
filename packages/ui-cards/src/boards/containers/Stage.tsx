import client from '@saashq/ui/src/apolloClient';
import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { queries } from '../graphql';
import { __, Alert, confirm, withProps } from '@saashq/ui/src/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import Stage from '../components/stage/Stage';
import { mutations } from '../graphql';
import {
  IFilterParams,
  IItem,
  IOptions,
  IStage,
  ItemsQueryResponse,
  RemoveStageMutation,
  SaveItemMutation,
  StagesSortItemsMutationResponse,
} from '../types';

type StageProps = {
  stage: IStage;
  index: number;
  loadingState: 'readyToLoad' | 'loaded';
  items: IItem[];
  length: number;
  queryParams: IFilterParams;
  options: IOptions;
  refetchStages: ({ pipelineId }: { pipelineId?: string }) => Promise<any>;
  onLoad: (stageId: string, items: IItem[]) => void;
  scheduleStage: (stageId: string) => void;
  refetchStage: (stageId: string) => void;
  onAddItem: (stageId: string, item: IItem, aboveItemId?: string) => void;
  onRemoveItem: (itemId: string, stageId: string) => void;
};

type FinalStageProps = {
  addMutation: SaveItemMutation;
  itemsQuery?: ItemsQueryResponse;
  removeStageMutation: RemoveStageMutation;
  stagesSortItemsMutation: StagesSortItemsMutationResponse;
} & StageProps;

class StageContainer extends React.PureComponent<FinalStageProps> {
  componentWillReceiveProps(nextProps: FinalStageProps) {
    const { stage, loadingState, onLoad, itemsQuery, options } = nextProps;

    if (itemsQuery && !itemsQuery.loading && loadingState !== 'loaded') {
      // Send loaded items to PipelineContext so that context is able to set it
      // to global itemsMap
      const items = itemsQuery[options.queriesName.itemsQuery] || [];
      onLoad(stage._id, items);
    }
  }

  componentDidMount() {
    const { scheduleStage, stage } = this.props;

    // register stage to queue on first render
    scheduleStage(stage._id);
  }

  loadMore = () => {
    const { onLoad, stage, items, queryParams, options } = this.props;

    if (items.length === stage.itemsTotalCount) {
      return;
    }

    client
      .query({
        query: gql(options.queries.itemsQuery),
        variables: {
          stageId: stage._id,
          pipelineId: stage.pipelineId,
          skip: items.length,
          ...getFilterParams(queryParams, options.getExtraParams),
        },
        fetchPolicy: 'network-only',
      })
      .then(({ data }: any) => {
        onLoad(stage._id, [
          ...items,
          ...(data[options.queriesName.itemsQuery] || []),
        ]);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  removeStage = (id: string) => {
    const { removeStageMutation, refetchStages, stage } = this.props;

    const message =
      'Tím trvale odstraníte všechny položky související s touto fází. jsi si naprosto jistý?';

    confirm(message, { hasDeleteConfirm: true })
      .then(() => {
        removeStageMutation({ variables: { _id: id } }).then(() => {
          Alert.success('Úspěšně jste odebrali fázi');

          refetchStages({ pipelineId: stage.pipelineId });
        });
      })
      .catch((e) => {
        Alert.error(e.message);
      });
  };

  archiveItems = () => {
    const { options, stage, onLoad } = this.props;

    const stageId = stage._id;

    confirm(__('Archivovat všechny karty v tomto seznamu?')).then(() => {
      const proccessId = Math.random().toString();
      localStorage.setItem('proccessId', proccessId);

      client
        .mutate({
          mutation: gql(options.mutations.archiveMutation),
          variables: { stageId },
          refetchQueries: [
            {
              query: gql(queries.stageDetail),
              variables: { _id: stageId, proccessId },
            },
          ],
        })
        .then(() => {
          Alert.success('Archivovat položky byly archivovány.');

          onLoad(stageId, []);
        })
        .catch((e: Error) => {
          Alert.error(e.message);
        });
    });
  };

  sortItems = (type: string, description: string) => {
    const { options, stage, stagesSortItemsMutation } = this.props;

    const stageId = stage._id;

    confirm(__(`Určitě třídíte podle ${description} ?`)).then(() => {
      const proccessId = Math.random().toString();
      localStorage.setItem('proccessId', proccessId);
      stagesSortItemsMutation({
        variables: {
          stageId,
          type: options.type,
          proccessId,
          sortType: type,
        },
      })
        .then(() => {
          this.props.refetchStage(stageId);
        })
        .catch((e: Error) => {
          Alert.error(e.message);
        });
    });
  };

  archiveList = () => {
    const { stage, refetchStages, options } = this.props;

    confirm(__('Archivovat tento seznam?')).then(() => {
      client
        .mutate({
          mutation: gql(mutations.stagesEdit),
          variables: {
            _id: stage._id,
            type: options.type,
            status: 'archived',
          },
        })
        .then(() => {
          Alert.success('Seznam archivů byl archivován.');

          refetchStages({ pipelineId: stage.pipelineId });
        })
        .catch((e: Error) => {
          Alert.error(e.message);
        });
    });
  };

  render() {
    const {
      index,
      length,
      stage,
      items,
      itemsQuery,
      options,
      onAddItem,
      onRemoveItem,
      loadingState,
    } = this.props;

    const loadingItems = () => {
      if ((itemsQuery && !itemsQuery.loading) || loadingState !== 'loaded') {
        return true;
      }

      return false;
    };

    return (
      <Stage
        options={options}
        stage={stage}
        index={index}
        length={length}
        items={items}
        archiveItems={this.archiveItems}
        sortItems={this.sortItems}
        archiveList={this.archiveList}
        removeStage={this.removeStage}
        loadingItems={loadingItems}
        loadMore={this.loadMore}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />
    );
  }
}

const getFilterParams = (
  queryParams: IFilterParams,
  getExtraParams: (queryParams) => any,
) => {
  if (!queryParams) {
    return {};
  }

  return {
    search: queryParams.search,
    customerIds: queryParams.customerIds,
    companyIds: queryParams.companyIds,
    assignedUserIds: queryParams.assignedUserIds,
    branchIds: queryParams.branchIds,
    departmentIds: queryParams.departmentIds,
    closeDateType: queryParams.closeDateType,
    labelIds: queryParams.labelIds,
    userIds: queryParams.userIds,
    segment: queryParams.segment,
    segmentData: queryParams.segmentData,
    assignedToMe: queryParams.assignedToMe,
    startDate: queryParams.startDate,
    endDate: queryParams.endDate,
    ...getExtraParams(queryParams),
  };
};

type WithQueryProps = StageProps & { abortController: any };

const withQuery = ({ options }) => {
  return withProps<WithQueryProps>(
    compose(
      graphql<WithQueryProps>(gql(options.queries.itemsQuery), {
        name: 'itemsQuery',
        skip: ({ loadingState }) => loadingState !== 'readyToLoad',
        options: ({ stage, queryParams, loadingState, abortController }) => ({
          variables: {
            stageId: stage._id,
            pipelineId: stage.pipelineId,
            ...getFilterParams(queryParams, options.getExtraParams),
          },
          context: {
            fetchOptions: { signal: abortController && abortController.signal },
          },
          fetchPolicy:
            loadingState === 'readyToLoad' ? 'network-only' : 'cache-only',
          notifyOnNetworkStatusChange: loadingState === 'readyToLoad',
        }),
      }),
      graphql<WithQueryProps>(gql(mutations.stagesRemove), {
        name: 'removeStageMutation',
      }),
      graphql<WithQueryProps>(gql(mutations.stagesSortItems), {
        name: 'stagesSortItemsMutation',
      }),
    )(StageContainer),
  );
};

class WithData extends React.Component<StageProps> {
  private withQuery;
  private abortController;

  constructor(props) {
    super(props);

    this.withQuery = withQuery({ options: props.options });
    this.abortController = new AbortController();
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  render() {
    const Component = this.withQuery;

    const updatedProps = {
      ...this.props,
      abortController: this.abortController,
    };

    return <Component {...updatedProps} />;
  }
}

export default withProps<StageProps>(WithData);
