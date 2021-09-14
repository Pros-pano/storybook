import React, { useState } from 'react';
import { Button, Icons, Separator, P } from '@storybook/components';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import { ButtonProps } from '@storybook/components/dist/ts3.9/Button/Button';
import { CallState, CallStates } from '../../types';
import { StatusBadge } from '../StatusBadge/StatusBadge';

const StyledSubnav = styled.nav(({ theme }) => ({
  background: theme.background.app,
  borderBottom: `1px solid ${theme.color.border}`,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 15,
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

export interface SubnavProps {
  status: CallState;
  onPrevious: () => void;
  onNext: () => void;
  onReplay: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  storyFileName?: string;
  hasPrevious: boolean;
  hasNext: boolean;
}

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 4,
  padding: 6,
  color: theme.color.dark,
  '&:hover,&:focus-visible': {
    color: theme.color.secondary,
  },
}));

const StyledIconButton = styled(StyledButton)(({ theme }) => ({
  color: theme.color.mediumdark,
  margin: '0 3px',
  '&:hover,&:focus-visible': {
    background: transparentize(0.9, theme.color.secondary),
  },
}));

interface AnimatedButtonProps extends ButtonProps {
  animating?: boolean;
}
const StyledAnimatedIconButton = styled(StyledIconButton)<AnimatedButtonProps>(
  ({ theme, animating }) => ({
    svg: {
      animation: animating && `${theme.animation.rotate360} 1000ms ease-out`,
    },
  })
);

const StyledSeparator = styled(Separator)({
  marginTop: 0,
});

const StyledLocation = styled(P)(({ theme }) => ({
  color: theme.color.dark,
  justifyContent: 'flex-end',
  textAlign: 'right',
  paddingRight: 15,
  fontSize: 13,
}));

const Group = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const RewindButton = styled(StyledIconButton)({
  marginLeft: 9,
});

const JumpToEndButton = styled(StyledButton)({
  marginLeft: 9,
  marginRight: 9,
});

export const Subnav: React.FC<SubnavProps> = ({
  status,
  onPrevious,
  onNext,
  onReplay,
  goToStart,
  goToEnd,
  storyFileName,
  hasNext,
  hasPrevious,
}) => {
  const buttonText = status === CallStates.ERROR ? 'Jump to error' : 'Jump to end';
  const [isAnimating, setIsAnimating] = useState(false);
  const animateAndReplay = () => {
    setIsAnimating(true);
    onReplay();
  };

  return (
    <StyledSubnav>
      <Group>
        <StatusBadge status={status} />

        <JumpToEndButton onClick={goToEnd} disabled={!hasNext}>
          {buttonText}
        </JumpToEndButton>

        <StyledSeparator />

        <RewindButton containsIcon title="Rewind" onClick={goToStart} disabled={!hasPrevious}>
          <Icons icon="rewind" />
        </RewindButton>
        <StyledIconButton
          containsIcon
          title="Previous step"
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          <Icons icon="playback" />
        </StyledIconButton>
        <StyledIconButton containsIcon title="Next step" onClick={onNext} disabled={!hasNext}>
          <Icons icon="playnext" />
        </StyledIconButton>
        <StyledAnimatedIconButton
          containsIcon
          title="Replay interactions"
          onClick={animateAndReplay}
          onAnimationEnd={() => setIsAnimating(false)}
          animating={isAnimating}
          data-test-id="button--replay"
        >
          <Icons icon="sync" />
        </StyledAnimatedIconButton>
      </Group>
      {storyFileName && (
        <Group>
          <StyledLocation>{storyFileName}</StyledLocation>
        </Group>
      )}
    </StyledSubnav>
  );
};
