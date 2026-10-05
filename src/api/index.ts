import { user } from "./user";
import { metaData } from "./metadata";
import { saleData } from "./sale";
import { sattleData } from "./sattle";
import { esportData } from "./esports";
import { historyData } from "./history";
import { operationLogData } from "./operationLog";
import { esportsSettlement } from "./esportsSettlement";
import { configCenterData } from "./configCenter";
import { playMethodData } from "./playMethd";
import { userMangerData } from "./userManger";
import { roleData } from "./role";
import { bettingCenter } from "./bettingCenter";
import { taskCenter } from '@/api/taskCenter';
import { riskManagementData } from './riskManagement';
import { operateManagementData } from './operateManagement';
import { sportTradingData } from './sportTrading';
import { eventData } from './event';

export const API = {
  ...user,
  ...metaData,
  ...saleData,
  ...sattleData,
  ...esportData,
  ...historyData,
  ...roleData,
  ...operationLogData,
  ...esportsSettlement,
  ...configCenterData,
  ...userMangerData,
  ...playMethodData,
  ...bettingCenter,
  ...taskCenter,
  ...riskManagementData,
  ...sportTradingData,
  ...operateManagementData,
  ...eventData
};
