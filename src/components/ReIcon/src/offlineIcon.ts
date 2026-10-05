import { addIcon } from '@iconify/vue/dist/offline';

/**
 * 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
 */

// 本地菜单图标，后端在路由的icon中返回对应的图标字符串并且前端在此处使用addIcon添加即可渲染菜单图标
import HomeFilled from '@iconify-icons/ep/home-filled';
import InformationLine from '@iconify-icons/ri/information-line';
import Lollipop from '@iconify-icons/ep/lollipop';
import RefreshRight from '@iconify-icons/ep/refresh-right';
import Crown from '@iconify-icons/ri/vip-crown-2-line';
import StoreFill from '@iconify-icons/ri/store-2-fill';
import FolderFill from '@iconify-icons/ri/folder-2-fill';
import LockUnlockFill from '@iconify-icons/ri/lock-unlock-line';
import LockFill from '@iconify-icons/ri/lock-fill';
import Monitor from '@iconify-icons/ep/monitor';
import infoFilled from '@iconify-icons/ep/info-filled';
import Files from '@iconify-icons/ep/files';
import OperationLog from '@iconify-icons/icon-park-outline/log';
import icon_circle_fill from '@iconify-icons/ri/add-circle-fill';
import uploadIcon from '@iconify-icons/ri/upload-2-fill';
import cancelIcon from '@iconify-icons/ri/close-circle-fill';
import icon_money from '@iconify-icons/ri/money-cny-box-fill';
import saveIcon from '@iconify-icons/ri/save-3-fill';
import listUnordered from '@iconify-icons/ri/list-unordered';
import addIcons from '@iconify-icons/ri/add-fill';
import AddFill from '@iconify-icons/ri/add-circle-line';
import deleteBin_5Line from '@iconify-icons/ri/delete-bin-5-line';
import loading from '@iconify-icons/ri/loader-2-line';
import EditPen from '@iconify-icons/ep/edit-pen';
import Delete from '@iconify-icons/ep/delete';
import dataManager from '@iconify-icons/ri/vip-crown-2-line';
import sale from '@iconify-icons/ri/store-2-fill';
import moneyDollarCircleFill from '@iconify-icons/ri/money-cny-circle-line';
import metadata from '@iconify-icons/ep/monitor';
import operateManager from '@iconify-icons/ep/files';
import clock from '@iconify-icons/ep/clock';
import menuTree from '@iconify-icons/ri/list-unordered';
import configCenter from '@iconify-icons/ri/settings-3-line';
import TaskCenterIcon from '@iconify-icons/ri/apps-fill';
import Download from '@iconify-icons/ep/download';
import play from '@iconify-icons/fa-solid/play-circle'
import switch_icon from '@iconify-icons/ep/switch-button';
import pause_circle from '@iconify-icons/fa-solid/pause-circle';
import lock_icon from '@iconify-icons/fa-solid/lock';
import Link from '@iconify-icons/icon-park-outline/link-one';
import Unlink from '@iconify-icons/icon-park-outline/unlink';
import EventManagementIcon from '@iconify-icons/ri/calendar-event-fill';
import Copy from '@iconify-icons/ep/copy-document';
import ChangeAccount from '@iconify-icons/fa-solid/user-edit';
import Back from '@iconify-icons/fa-solid/arrow-left';
import LogoutCircleRLine from '@iconify-icons/ri/logout-circle-r-line';
import clock1 from '@iconify-icons/ri/alarm-fill';
import Setting from '@iconify-icons/ri/settings-3-line';
import Check from '@iconify-icons/ri/check-fill';
import MenuFold from "@iconify-icons/ri/menu-fold-fill";
import MenuUnfold from "@iconify-icons/ri/menu-unfold-fill";


addIcon("Setting", Setting);
addIcon("MenuFold", MenuFold);
addIcon("MenuUnfold", MenuUnfold);
addIcon("dataSourceManager", dataManager);
addIcon("LogoutCircleRLine", LogoutCircleRLine);
addIcon("sale", sale);
addIcon("settle", moneyDollarCircleFill);
addIcon("SportsOperationsManagement", metadata);
addIcon("ESportOperateManager", metadata);
addIcon("metadata", metadata);
addIcon("operateManager", operateManager);
addIcon("systemManager", dataManager);
addIcon("operationLog1", OperationLog);
addIcon("menuTree", menuTree);
addIcon("configCenter", configCenter);
addIcon("riskManagement", sale);
addIcon("taskCenter", TaskCenterIcon);
addIcon("download", Download);
addIcon("SportTrading", metadata);
addIcon("eventManagement", EventManagementIcon);
addIcon("copyIcon", Copy);
addIcon("refreshRight", RefreshRight);
addIcon("infoFilled", infoFilled);
addIcon("refreshRight", RefreshRight);
addIcon("clockIcon", clock1);

/* 菜单icon结束 */
//- 操盘图标开始
addIcon("trading_play", play);
addIcon("trading_switch", switch_icon);
addIcon("trading_pause", pause_circle);
addIcon("trading_lock", lock_icon);


addIcon('homeFilled', HomeFilled);
addIcon('informationLine', InformationLine);
addIcon('lollipop', Lollipop);
addIcon('crown', Crown);
addIcon('storeFill', StoreFill);
addIcon('folderFill', FolderFill);
addIcon('monitor', Monitor);
addIcon('files', Files);
addIcon('unlock', LockUnlockFill);
addIcon('lock', LockFill);
addIcon('icon_circle_fill', icon_circle_fill);
addIcon('icon_money', icon_money);
addIcon('uploadIcon', uploadIcon);
addIcon('cancelIcon', cancelIcon);
addIcon('saveIcon', saveIcon);
addIcon('moneyDollarCircleFill', moneyDollarCircleFill);
addIcon('listUnordered', listUnordered);
addIcon('addIcon', addIcons);
addIcon('addFill', AddFill);
addIcon('editPen', EditPen);
addIcon('deleteBin_5Line', deleteBin_5Line);
addIcon('Delete', Delete);
addIcon('loadingIcon', loading);
addIcon('download', Download);
addIcon('link', Link);
addIcon('unlink', Unlink);
addIcon('changeAccount', ChangeAccount);
addIcon('back', Back);
addIcon('check', Check);
