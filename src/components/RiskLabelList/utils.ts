import { labelListType } from '@/views/operateManager/com/playerList/utils/types';

export const getLabelColor = (level: number, type: string) => {
  if (type === 'risk') {
    switch (level) {
      case 1:
        return 'rgba(163, 0, 20, 1)';
      case 2:
        return 'rgba(255, 92, 0, 1)';
      case 3:
        return 'rgba(255, 153, 0, 1)';
    }
  } else {
    switch (level) {
      case 1:
        return 'rgba(24, 145, 255, 1)';
      case 2:
        return 'rgba(25, 190, 107, 1)';
      case 3:
        return 'rgba(46, 64, 80, 1)';
    }
  }
};

export const getLabelLevelByName = (
  labelList: labelListType,
  lableName: string
) => {
  return labelList.risk.find(label => label.name == lableName)?.level;
};
