import * as JsSIP from 'jssip';
import * as PropTypes from 'prop-types';
import React from 'react';
import dummyLogger from '../../lib/dummyLogger';

import {
  CALL_DIRECTION_INCOMING,
  CALL_DIRECTION_OUTGOING,
  CALL_STATUS_ACTIVE,
  CALL_STATUS_IDLE,
  CALL_STATUS_STARTING,
  CALL_STATUS_STOPPING,
  SIP_ERROR_TYPE_CONFIGURATION,
  SIP_ERROR_TYPE_CONNECTION,
  SIP_ERROR_TYPE_REGISTRATION,
  SIP_STATUS_CONNECTED,
  SIP_STATUS_CONNECTING,
  SIP_STATUS_DISCONNECTED,
  SIP_STATUS_ERROR,
  SIP_STATUS_REGISTERED,
} from '../../lib/enums';
import {
  CallDirection,
  CallStatus,
  SipErrorType,
  SipStatus,
} from '../../lib/enums';
import {
  callPropType,
  ExtraHeaders,
  extraHeadersPropType,
  IceServers,
  iceServersPropType,
  sipPropType,
} from '../../lib/types';
import { ICallConfigDoc } from '../../types';
import { setLocalStorage } from '../../utils';

export default class SipProvider extends React.Component<
  {
    host: string;
    port: number;
    pathname: string;
    user: string;
    password: string;
    autoRegister: boolean;
    autoAnswer: boolean;
    iceRestart: boolean;
    sessionTimersExpires: number;
    extraHeaders: ExtraHeaders;
    iceServers: IceServers;
    debug: boolean;
    children: any;
    callUserIntegration: ICallConfigDoc;
    createSession: () => void;
    updateHistory: (
      callId: string,
      callStartTime: Date,
      callEndTime: Date,
      callStatus: string,
    ) => void;
    callsActiveSession: any;
  },
  {
    sipStatus: SipStatus;
    sipErrorType: SipErrorType | null;
    sipErrorMessage: string | null;
    callStatus: CallStatus;
    callDirection: CallDirection | null;
    callCounterpart: string | null;
    callId: string | null;
    rtcSession;
  }
> {
  public static childContextTypes = {
    sip: sipPropType,
    call: callPropType,
    registerSip: PropTypes.func,
    unregisterSip: PropTypes.func,

    answerCall: PropTypes.func,
    startCall: PropTypes.func,
    stopCall: PropTypes.func,

    isMuted: PropTypes.func,
    mute: PropTypes.func,
    unmute: PropTypes.func,

    sendDtmf: PropTypes.func,

    isHolded: PropTypes.func,
    hold: PropTypes.func,
    unhold: PropTypes.func,
  };

  public static propTypes = {
    host: PropTypes.string,
    port: PropTypes.number,
    pathname: PropTypes.string,
    user: PropTypes.string,
    password: PropTypes.string,
    autoRegister: PropTypes.bool,
    autoAnswer: PropTypes.bool,
    iceRestart: PropTypes.bool,
    sessionTimersExpires: PropTypes.number,
    extraHeaders: extraHeadersPropType,
    iceServers: iceServersPropType,
    debug: PropTypes.bool,
  };

  public static defaultProps = {
    host: null,
    port: null,
    pathname: '',
    user: null,
    password: null,
    autoRegister: true,
    autoAnswer: false,
    iceRestart: true,
    sessionTimersExpires: 1800,
    extraHeaders: { register: [], invite: [] },
    iceServers: [],
    debug: false,
  };
  private ua;
  private remoteAudio;
  private logger;

  constructor(props) {
    super(props);
    this.state = {
      sipStatus: SIP_STATUS_DISCONNECTED,
      sipErrorType: null,
      sipErrorMessage: null,
      rtcSession: null,
      callStatus: CALL_STATUS_IDLE,
      callDirection: null,
      callCounterpart: null,
      callId: null,
    };
    this.ua = null;

    this.remoteAudio = window.document.getElementById('sip-provider-audio');
    this.remoteAudio?.remove();
  }

  public getChildContext() {
    return {
      sip: {
        ...this.props,
        status: this.state.sipStatus,
        errorType: this.state.sipErrorType,
        errorMessage: this.state.sipErrorMessage,
      },
      call: {
        id: this.state.rtcSession?._id,
        status: this.state.callStatus,
        direction: this.state.callDirection,
        counterpart: this.state.callCounterpart,
        startTime: this.state.rtcSession?._start_time?.toString(),
      },
      registerSip: this.registerSip,
      unregisterSip: this.unregisterSip,

      answerCall: this.answerCall,
      startCall: this.startCall,
      stopCall: this.stopCall,

      isMuted: this.isMuted,
      mute: this.mute,
      unmute: this.unmute,

      sendDtmf: this.sendDtmf,

      isHolded: this.isHolded,
      hold: this.hold,
      unhold: this.unhold,
    };
  }

  public componentDidMount() {
    const callConfig = JSON.parse(
      localStorage.getItem('config:call_integrations') || '{}',
    );
    const callInfo = JSON.parse(localStorage.getItem('callInfo') as string);

    if (
      this.state.sipStatus === SIP_STATUS_REGISTERED &&
      callInfo?.isUnRegistered
    ) {
      this.unregisterSip();
    }

    if (callConfig && !callConfig.isAvailable) {
      return this.props.children(this.state);
    }
    if (window.document.getElementById('sip-provider-audio')) {
      throw new Error(
        `Vytvoření dvou SipProviderů v jedné aplikaci je zakázáno. Pokud tomu tak není ` +
          `pak zkontrolujte, zda používáte "sip-provider-audio" jako atribut id pro všechny existující ` +
          `živel`,
      );
    }

    this.remoteAudio = window.document.createElement('audio');
    this.remoteAudio.id = 'sip-provider-audio';
    window.document.body.appendChild(this.remoteAudio);

    this.reconfigureDebug();
    this.reinitializeJsSIP();
  }

  public componentDidUpdate(prevProps) {
    const callConfig = JSON.parse(
      localStorage.getItem('config:call_integrations') || '{}',
    );
    if (callConfig && !callConfig.isAvailable) {
      return this.props.children(this.state);
    }

    if (this.props.debug !== prevProps.debug) {
      this.reconfigureDebug();
    }
    if (
      this.props.host !== prevProps.host ||
      this.props.port !== prevProps.port ||
      this.props.pathname !== prevProps.pathname ||
      this.props.user !== prevProps.user ||
      this.props.password !== prevProps.password ||
      this.props.autoRegister !== prevProps.autoRegister
    ) {
      this.reinitializeJsSIP();
    }
    const { callUserIntegration } = this.props;
    const { inboxId, phone, wsServer, token, operators } =
      callUserIntegration || {};
    if (
      inboxId !== callConfig.inboxId ||
      phone !== callConfig.phone ||
      wsServer !== callConfig.wsServer ||
      token !== callConfig.token ||
      operators !== callConfig.operators
    ) {
      localStorage.setItem(
        'config:call_integrations',
        JSON.stringify({
          inboxId: inboxId,
          phone: phone,
          wsServer: wsServer,
          token: token,
          operators: operators,
          isAvailable: callConfig.isAvailable,
        }),
      );
    }
  }

  public componentWillUnmount() {
    this.remoteAudio?.parentNode?.removeChild(this.remoteAudio);
    this.remoteAudio = null;
    if (this.ua) {
      this.ua.stop();
      this.ua = null;
    }
  }

  public registerSip = () => {
    if (this.props.autoRegister) {
      throw new Error(
        'Volání registerSip není povoleno, když autoRegister === skutečný',
      );
    }
    if (this.state.sipStatus !== SIP_STATUS_CONNECTED) {
      throw new Error(
        `Volání registerSip není povoleno, když je stav sip ${this.state.sipStatus} (očekávaný ${SIP_STATUS_CONNECTED})`,
      );
    }
    return this.ua.register();
  };

  public unregisterSip = () => {
    if (this.props.autoRegister) {
      throw new Error(
        'Volání registerSip není povoleno, když autoRegister === skutečný',
      );
    }
    if (this.state.sipStatus !== SIP_STATUS_REGISTERED) {
      throw new Error(
        `Volání zrušit registraciSip není povoleno, když je stav sip ${this.state.sipStatus} (očekávaný ${SIP_STATUS_CONNECTED})`,
      );
    }
    return this.ua.unregister();
  };

  public answerCall = () => {
    if (
      this.state.callStatus !== CALL_STATUS_STARTING ||
      this.state.callDirection !== CALL_DIRECTION_INCOMING
    ) {
      throw new Error(
        `Volání answerCall() není povoleno, když je stav volání ${this.state.callStatus} a směr hovoru je ${this.state.callDirection}  (očekávaný ${CALL_STATUS_STARTING} a ${CALL_DIRECTION_INCOMING})`,
      );
    }

    this.state.rtcSession.answer({
      mediaConstraints: {
        audio: true,
        video: false,
      },
      pcConfig: {
        iceServers: this.props.iceServers,
      },
    });
  };

  public sendDtmf = (tones) => {
    this.state.rtcSession.sendDTMF(tones);
    return 'calledSendDtmf';
  };

  public isMuted = () => {
    return this.state.rtcSession?._audioMuted || false;
  };

  public isHolded = () => {
    return {
      localHold: this.state.rtcSession?._localHold,
      remoteHold: this.state.rtcSession?._remoteHold,
    };
  };

  public mute = () => {
    this.state.rtcSession.mute();
  };

  public unmute = () => {
    this.state.rtcSession.unmute();
  };

  public hold = () => {
    this.state.rtcSession.hold();
  };
  public unhold = () => {
    this.state.rtcSession.unhold();
  };

  public startCall = (destination) => {
    if (!destination) {
      throw new Error(`Cíl musí být definován (${destination} daný)`);
    }
    if (
      this.state.sipStatus !== SIP_STATUS_CONNECTED &&
      this.state.sipStatus !== SIP_STATUS_REGISTERED
    ) {
      throw new Error(
        `Volání startCall() není povoleno, když je stav sip ${this.state.sipStatus} (očekávaný ${SIP_STATUS_CONNECTED} nebo ${SIP_STATUS_REGISTERED})`,
      );
    }

    if (this.state.callStatus !== CALL_STATUS_IDLE) {
      throw new Error(
        `Volání startCall() není povoleno, když je stav volání ${this.state.callStatus} (očekávaný ${CALL_STATUS_IDLE})`,
      );
    }

    const { iceServers, sessionTimersExpires } = this.props;
    const extraHeaders = this.props.extraHeaders.invite;

    const options = {
      extraHeaders,
      mediaConstraints: { audio: true, video: false },
      rtcOfferConstraints: { iceRestart: this.props.iceRestart },
      pcConfig: {
        iceServers,
      },
      sessionTimersExpires,
    };

    this.ua.call(destination, options);

    this.setState({ callStatus: CALL_STATUS_STARTING });
  };

  public stopCall = () => {
    this.setState({ callStatus: CALL_STATUS_STOPPING });
    this.ua?.terminateSessions();
  };

  public reconfigureDebug() {
    const { debug } = this.props;

    if (debug) {
      JsSIP.debug.enable('JsSIP:*');
      this.logger = console;
    } else {
      JsSIP.debug.disable();
      this.logger = dummyLogger;
    }
  }

  public reinitializeJsSIP() {
    if (this.ua) {
      this.ua.stop();
      this.ua = null;
    }

    const { host, port, pathname, user, password, autoRegister } = this.props;
    if (!host || !port || !user) {
      this.setState({
        sipStatus: SIP_STATUS_DISCONNECTED,
        sipErrorType: null,
        sipErrorMessage: null,
      });
      return;
    }

    try {
      const socket = new JsSIP.WebSocketInterface(
        `wss://${host}:${port}${pathname}`,
      );
      const options = {
        uri: `sip:${user}@${host}`,
        password,
        sockets: [socket],
        register: autoRegister,
      } as any;

      this.ua = new JsSIP.UA(options);
    } catch (error) {
      this.logger.debug('Chyba', error.message, error);
      this.setState({
        sipStatus: SIP_STATUS_ERROR,
        sipErrorType: SIP_ERROR_TYPE_CONFIGURATION,
        sipErrorMessage: error?.message,
      });
      return;
    }

    const { ua } = this;

    ua.on('connecting', () => {
      this.logger?.debug('UA "spojující" událost');
      setLocalStorage(false, true);

      if (this.ua !== ua) {
        return;
      }
      this.setState({
        sipStatus: SIP_STATUS_CONNECTING,
        sipErrorType: null,
        sipErrorMessage: null,
      });
    });

    ua.on('connected', () => {
      this.logger?.debug('UA "spojující" událost');

      setLocalStorage(false, true);

      if (this.ua !== ua) {
        return;
      }
      this.setState({
        sipStatus: SIP_STATUS_CONNECTED,
        sipErrorType: null,
        sipErrorMessage: null,
      });
    });

    ua.on('disconnected', () => {
      this.logger.debug('UA "odpojeno" událost');
      if (this.ua !== ua) {
        return;
      }
      setLocalStorage(false, false);

      this.setState({
        sipStatus: SIP_STATUS_ERROR,
        sipErrorType: SIP_ERROR_TYPE_CONNECTION,
        sipErrorMessage: 'disconnected',
      });
    });

    ua.on('registered', (data) => {
      this.logger.debug('UA "registrovaná" událost', data);
      if (this.ua !== ua) {
        return;
      }
      this.setState({
        sipStatus: SIP_STATUS_REGISTERED,
        callStatus: CALL_STATUS_IDLE,
      });

      setLocalStorage(true, true);

      if (!this.props.callsActiveSession) {
        this.props.createSession();
      }
    });

    ua.on('unregistered', () => {
      this.logger.debug('UA "neregistrovaná" akce');
      if (this.ua !== ua) {
        return;
      }
      if (ua.isConnected()) {
        this.setState({
          sipStatus: SIP_STATUS_CONNECTED,
          callStatus: CALL_STATUS_IDLE,
          callDirection: null,
        });
      } else {
        this.setState({
          sipStatus: SIP_STATUS_DISCONNECTED,
          callStatus: CALL_STATUS_IDLE,
          callDirection: null,
        });
      }
    });

    ua.on('registrationFailed', (data) => {
      this.logger.debug('UA událost „registrace se nezdařila“');

      if (this.ua !== ua) {
        return;
      }

      this.setState({
        sipStatus: SIP_STATUS_ERROR,
        sipErrorType: SIP_ERROR_TYPE_REGISTRATION,
        sipErrorMessage: data?.cause || '',
      });
    });

    ua.on('muted', (data) => {});

    ua.on(
      'newRTCSession',
      ({ originator, session: rtcSession, request: rtcRequest }) => {
        if (!this || this.ua !== ua) {
          return;
        }
        // identify call direction
        if (originator === 'local') {
          const foundUri = rtcRequest.to.toString();
          const toDelimiterPosition = foundUri.indexOf(';') || null;
          this.setState({
            callDirection: CALL_DIRECTION_OUTGOING,
            callStatus: CALL_STATUS_STARTING,
            callCounterpart:
              foundUri.substring(0, toDelimiterPosition) || foundUri,
          });
        } else if (originator === 'remote') {
          const foundUri = rtcRequest.from.toString();
          const delimiterPosition = foundUri.indexOf(';') || null;
          this.setState({
            callDirection: CALL_DIRECTION_INCOMING,
            callStatus: CALL_STATUS_STARTING,
            callCounterpart:
              foundUri.substring(0, delimiterPosition) || foundUri,
          });
        }

        const { rtcSession: rtcSessionInState } = this.state;

        // Avoid if busy or other incoming
        if (rtcSessionInState) {
          this.logger.debug('příchozí hovor odpověděl 486 "Zaneprázdněn zde"');
          rtcSession.terminate({
            status_code: 486,
            reason_phrase: 'Busy Here',
          });
          return;
        }
        this.setState({ rtcSession });
        rtcSession.on('progress', function (data) {
          if (data.originator === 'remote') data.response.body = null;
        });
        rtcSession.on('failed', (e) => {
          this.logger.debug('UA neúspěšná událost');
          if (this.ua !== ua) {
            return;
          }
          console.log('nepodařilo:', e);
          const { updateHistory } = this.props;
          const { rtcSession: session } = this.state;

          if (updateHistory && session) {
            updateHistory(
              session._id,
              session.start_time,
              session.end_time,
              'cancelled',
            );
          }
          this.setState({
            rtcSession: null,
            callStatus: CALL_STATUS_IDLE,
            callDirection: null,
            callCounterpart: null,
          });
          ua?.terminateSessions();

          rtcSession = null;
        });
        rtcSession.on('peerconnection', (e) => {
          if (this.ua !== ua) {
            return;
          }
        });

        rtcSession.on('ended', (data) => {
          if (this.ua !== ua) {
            return;
          }
          console.log('skončilo:', data);
          const { updateHistory } = this.props;
          const { rtcSession: session } = this.state;

          if (updateHistory && session) {
            updateHistory(
              session._id,
              session.start_time,
              session.end_time,
              'connected',
            );
          }
          this.setState({
            rtcSession: null,
            callStatus: CALL_STATUS_IDLE,
            callDirection: null,
            callCounterpart: null,
          });
          this.ua?.terminateSessions();
          rtcSession = null;
        });

        rtcSession.on('bye', () => {
          if (this.ua !== ua) {
            return;
          }
          this.setState({
            rtcSession: null,
            callStatus: CALL_STATUS_IDLE,
            callDirection: null,
            callCounterpart: null,
          });
          this.ua?.terminateSessions();
          rtcSession = null;
        });

        rtcSession.on('rejected', function (e) {
          if (this.ua !== ua) {
            return;
          }
          const { updateHistory } = this.props;
          const { rtcSession: session } = this.state;
          if (updateHistory && session) {
            updateHistory(
              session._id,
              session.start_time,
              session.end_time,
              'rejected',
            );
          }

          this.setState({
            rtcSession: null,
            callStatus: CALL_STATUS_IDLE,
            callDirection: null,
            callCounterpart: null,
          });
          this.ua?.terminateSessions();
        });

        rtcSession.on('accepted', () => {
          if (this.ua !== ua) {
            return;
          }

          [this.remoteAudio.srcObject] =
            rtcSession.connection.getRemoteStreams();

          const played = this.remoteAudio.play();

          if (typeof played !== 'undefined') {
            played
              .catch(() => {
                /**/
              })
              .then(() => {
                setTimeout(() => {
                  this.remoteAudio.play();
                }, 2000);
              });
            this.setState({ callStatus: CALL_STATUS_ACTIVE });
            return;
          }

          setTimeout(() => {
            this.remoteAudio.play();
          }, 2000);

          this.setState({ callStatus: CALL_STATUS_ACTIVE });
        });
        if (
          this.state.callDirection === CALL_DIRECTION_INCOMING &&
          this.props.autoAnswer
        ) {
          this.logger.log('Odpovědět auto ON');
          this.answerCall();
        } else if (
          this.state.callDirection === CALL_DIRECTION_INCOMING &&
          !this.props.autoAnswer
        ) {
          this.logger.log('Automatické vypnutí odpovědi');
        } else if (this.state.callDirection === CALL_DIRECTION_OUTGOING) {
          this.logger.log('Odchozí hovor');

          setTimeout(() => {
            this.remoteAudio.play();
          }, 2000);
        }
      },
    );

    const extraHeadersRegister = this.props.extraHeaders.register || [];
    if (extraHeadersRegister.length) {
      ua.registrator().setExtraHeaders(extraHeadersRegister);
    }
    ua.start();
  }

  public render() {
    console.log('sip state: ', this.state);
    return this.props.children(this.state);
  }
}
