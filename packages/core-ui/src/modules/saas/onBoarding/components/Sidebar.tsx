import React from 'react';
import { LeftSidebar, SidebarHeader } from 'modules/saas/onBoarding/styles';
import Indicator from './Indicator';
import Messenger from '../container/messenger/Messenger';
import Welcome from './welcome/Welcome';
import MessengerScript from './messengerScript/MessengerScript';
import ProfileSetup from '../container/profile/ProfileSetup';
import { IUser } from '@saashq/ui/src/auth/types';
import { IIntegration } from '@saashq/ui-inbox/src/settings/integrations/types';
import OnBoardingDone from '../container/OnBoardingDone';

type Props = {
  history: any;
  activeStep: number;
  totalStep: number;
  currentUser: IUser;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (name: string) => void;
  avatar: string;
  setAvatar: (name: string) => void;
  brandName: string;
  setBrandName: (name: string) => void;
  color: string;
  setColor: (color: string) => void;
  integration: IIntegration;
  onboardingSteps: any[];
};

const Sidebar = (props: Props) => {
  const {
    history,
    activeStep,
    totalStep,
    currentUser,
    integration,
    onboardingSteps,
    firstName,
    lastName,
    email,
    setFirstName,
    setLastName,
    setEmail,
    avatar,
    setAvatar,
    brandName,
    setBrandName,
    color,
    setColor,
  } = props;

  const renderContent = () => {
    const commonProps = {
      history,
    };

    const profileProps = {
      firstName,
      lastName,
      email,
      setFirstName,
      setLastName,
      setEmail,
      avatar,
      setAvatar,
    };

    const messengerProps = {
      brandName,
      setBrandName,
      color,
      setColor,
    };

    if (activeStep === 0) {
      return <Welcome {...commonProps} />;
    }

    if (activeStep === totalStep) {
      return <OnBoardingDone />;
    }

    return (onboardingSteps || []).map((step) => {
      if (step === 'setupProfile') {
        if (activeStep === 1) {
          return (
            <ProfileSetup
              {...commonProps}
              currentUser={currentUser}
              {...profileProps}
            />
          );
        }
      }

      if (step === 'installMessenger') {
        if (activeStep === 2) {
          return (
            <Messenger
              {...commonProps}
              {...messengerProps}
              integration={integration}
            />
          );
        }

        if (activeStep === 3) {
          return <MessengerScript {...commonProps} integration={integration} />;
        }
      }
    });
  };

  const renderHeaderInfo = () => {
    if (activeStep === 0) {
      return null;
    }

    if (activeStep === totalStep) {
      return (
        <>
          <h2>Úspěšný 🎉</h2>
          <p>
            Gratulujeme k úspěšnému vytvoření vaší organizace! Vítejte na naši
            platformu. Jsme rádi, že vás máme na palubě a díváme se těšíme se na
            vaši podporu na vaší cestě.
            <br />
            <br />
            Užijte si čas s námi!
          </p>
        </>
      );
    }

    return (onboardingSteps || []).map((step) => {
      if (step === 'setupProfile') {
        if (activeStep === 1) {
          return (
            <>
              <h2>Nastavení profilu</h2>
              <p>Chcete-li zahájit nastavení účtu, vyplňte formulář níže.</p>
            </>
          );
        }
      }

      if (step === 'installMessenger') {
        if (activeStep === 2) {
          return (
            <>
              <h2>Přizpůsobte messenger</h2>
              <p>
                Integrace SaasHQ messenger do vašich webových stránek umožňuje
                bezproblémové komunikace se zákazníky v reálném čase.
                Přizpůsobte si svůj messenger, aby dokonale ladil s vaší
                značkou.
              </p>
            </>
          );
        }

        if (activeStep === 3) {
          return (
            <>
              <h2>
                Připojte zdroj zákazníka <br /> pro přístup k vaší org
              </h2>
              <p>
                Referenční zákaznický zdroj bude jedinečným zdrojem, který
                automaticky vytvoří záznamy o vašich kontaktech a účtech saashq.
                Poté budete moci připojit další integrace přidat svým zákazníkům
                další data, jako jsou lístky podpory, úkol, CRM a další.
              </p>
            </>
          );
        }
      }
    });
  };

  return (
    <LeftSidebar showStar={activeStep === 0 || false}>
      {activeStep === 0 && (
        <img src="/images/home/home3.png" className="shooting-star" />
      )}
      {activeStep === 0 && (
        <img src="/images/shootingStars.png" className="welcome-cover" />
      )}
      {activeStep !== 0 && (
        <SidebarHeader>
          <div className="header">{renderHeaderInfo()}</div>
          {<Indicator totalStep={totalStep} activeStep={activeStep} />}
        </SidebarHeader>
      )}
      {renderContent()}
    </LeftSidebar>
  );
};

export default Sidebar;
