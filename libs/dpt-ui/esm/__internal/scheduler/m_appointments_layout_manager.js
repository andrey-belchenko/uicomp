/**
 * DevExtreme (esm/__internal/scheduler/m_appointments_layout_manager.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    equalByValue
} from "../../core/utils/common";
import dateUtils from "../../core/utils/date";
import {
    getAppointmentRenderingStrategyName,
    getCellDuration,
    getGroupCount
} from "../scheduler/r1/utils/index";
import {
    AppointmentViewModelGenerator
} from "./appointments/m_view_model_generator";
import {
    getAllDayHeight,
    getCellHeight,
    getCellWidth
} from "./workspaces/helpers/m_position_helper";
const toMs = dateUtils.dateToMilliseconds;
class AppointmentLayoutManager {
    constructor(instance) {
        this.instance = instance;
        this.appointmentViewModel = new AppointmentViewModelGenerator
    }
    get appointmentRenderingStrategyName() {
        return getAppointmentRenderingStrategyName(this.instance.currentViewType)
    }
    getCellDimensions(options) {
        if (this.instance._workSpace) {
            return {
                width: this.instance._workSpace.getCellWidth(),
                height: this.instance._workSpace.getCellHeight(),
                allDayHeight: this.instance._workSpace.getAllDayHeight()
            }
        }
        return
    }
    _getRenderingStrategyOptions() {
        const workspace = this.instance.getWorkSpace();
        const {
            virtualScrollingDispatcher: virtualScrollingDispatcher
        } = this.instance.getWorkSpace();
        const {
            cellCountInsideLeftVirtualCell: cellCountInsideLeftVirtualCell,
            cellCountInsideTopVirtualRow: cellCountInsideTopVirtualRow
        } = virtualScrollingDispatcher;
        const groupCount = getGroupCount(this.instance.option("loadedResources"));
        const DOMMetaData = workspace.getDOMElementsMetaData();
        const allDayHeight = getAllDayHeight(workspace.option("showAllDayPanel"), workspace._isVerticalGroupedWorkSpace(), DOMMetaData);
        const rowCount = workspace._getRowCount();
        const {
            positionHelper: positionHelper,
            viewDataProvider: viewDataProvider
        } = workspace;
        const visibleDayDuration = viewDataProvider.getVisibleDayDuration(workspace.option("startDayHour"), workspace.option("endDayHour"), workspace.option("hoursInterval"));
        const cellDuration = getCellDuration(workspace.type, workspace.option("startDayHour"), workspace.option("endDayHour"), workspace.option("hoursInterval"));
        return {
            resources: this.instance.option("resources"),
            loadedResources: this.instance.option("loadedResources"),
            getAppointmentColor: this.instance.createGetAppointmentColor(),
            dataAccessors: this.instance._dataAccessors,
            appointmentRenderingStrategyName: this.appointmentRenderingStrategyName,
            adaptivityEnabled: this.instance.option("adaptivityEnabled"),
            rtlEnabled: this.instance.option("rtlEnabled"),
            startDayHour: this.instance._getCurrentViewOption("startDayHour"),
            endDayHour: this.instance._getCurrentViewOption("endDayHour"),
            viewOffset: this.instance._getCurrentViewOption("offset") * toMs("minute"),
            maxAppointmentsPerCell: this.instance._getCurrentViewOption("maxAppointmentsPerCell"),
            currentDate: this.instance.option("currentDate"),
            isVirtualScrolling: this.instance.isVirtualScrolling(),
            leftVirtualCellCount: cellCountInsideLeftVirtualCell,
            topVirtualCellCount: cellCountInsideTopVirtualRow,
            intervalCount: workspace.option("intervalCount"),
            hoursInterval: workspace.option("hoursInterval"),
            showAllDayPanel: workspace.option("showAllDayPanel"),
            isGroupedAllDayPanel: workspace.isGroupedAllDayPanel(),
            groups: this.instance._getCurrentViewOption("groups"),
            groupCount: groupCount,
            rowCount: rowCount,
            appointmentCountPerCell: this.instance.option("_appointmentCountPerCell"),
            appointmentOffset: this.instance.option("_appointmentOffset"),
            allowResizing: this.instance._allowResizing(),
            allowAllDayResizing: this.instance._allowAllDayResizing(),
            startViewDate: workspace.getStartViewDate(),
            groupOrientation: workspace._getRealGroupOrientation(),
            cellWidth: getCellWidth(DOMMetaData),
            cellHeight: getCellHeight(DOMMetaData),
            allDayHeight: allDayHeight,
            resizableStep: positionHelper.getResizableStep(),
            visibleDayDuration: visibleDayDuration,
            allDayPanelMode: this.instance._getCurrentViewOption("allDayPanelMode"),
            timeZoneCalculator: this.instance.timeZoneCalculator,
            timeZone: this.instance.option("timeZone"),
            firstDayOfWeek: this.instance.getFirstDayOfWeek(),
            viewStartDayHour: this.instance._getCurrentViewOption("startDayHour"),
            viewEndDayHour: this.instance._getCurrentViewOption("endDayHour"),
            viewType: workspace.type,
            endViewDate: workspace.getEndViewDate(),
            positionHelper: positionHelper,
            isGroupedByDate: workspace.isGroupedByDate(),
            cellDuration: cellDuration,
            cellDurationInMinutes: workspace.option("cellDuration"),
            viewDataProvider: workspace.viewDataProvider,
            supportAllDayRow: workspace.supportAllDayRow(),
            dateRange: workspace.getDateRange(),
            intervalDuration: workspace.getIntervalDuration(),
            allDayIntervalDuration: workspace.getIntervalDuration(true),
            isVerticalGroupOrientation: workspace.isVerticalOrientation(),
            DOMMetaData: DOMMetaData,
            instance: this.instance,
            agendaDuration: workspace.option("agendaDuration")
        }
    }
    createAppointmentsMap(items) {
        const renderingStrategyOptions = this._getRenderingStrategyOptions();
        const {
            viewModel: viewModel,
            positionMap: positionMap
        } = this.appointmentViewModel.generate(items, renderingStrategyOptions);
        this._positionMap = positionMap;
        return viewModel
    }
    _isDataChanged(data) {
        const {
            appointmentDataProvider: appointmentDataProvider
        } = this.instance;
        const updatedData = appointmentDataProvider.getUpdatedAppointment();
        return updatedData === data || appointmentDataProvider.getUpdatedAppointmentKeys().some((item => data[item.key] === item.value))
    }
    _isAppointmentShouldAppear(currentAppointment, sourceAppointment) {
        return currentAppointment.needRepaint && sourceAppointment.needRemove
    }
    _isSettingChanged(settings, sourceSetting) {
        if (settings.length !== sourceSetting.length) {
            return true
        }
        const createSettingsToCompare = (settings, index) => {
            const currentSetting = settings[index];
            const leftVirtualCellCount = currentSetting.leftVirtualCellCount || 0;
            const topVirtualCellCount = currentSetting.topVirtualCellCount || 0;
            const columnIndex = currentSetting.columnIndex + leftVirtualCellCount;
            const rowIndex = currentSetting.rowIndex + topVirtualCellCount;
            const hMax = currentSetting.reduced ? currentSetting.hMax : void 0;
            const vMax = currentSetting.reduced ? currentSetting.vMax : void 0;
            return _extends({}, currentSetting, {
                columnIndex: columnIndex,
                rowIndex: rowIndex,
                positionByMap: void 0,
                topVirtualCellCount: void 0,
                leftVirtualCellCount: void 0,
                leftVirtualWidth: void 0,
                topVirtualHeight: void 0,
                hMax: hMax,
                vMax: vMax,
                info: {}
            })
        };
        for (let i = 0; i < settings.length; i++) {
            const newSettings = createSettingsToCompare(settings, i);
            const oldSettings = createSettingsToCompare(sourceSetting, i);
            if (oldSettings) {
                oldSettings.sortedIndex = newSettings.sortedIndex
            }
            if (!equalByValue(newSettings, oldSettings)) {
                return true
            }
        }
        return false
    }
    _getAssociatedSourceAppointment(currentAppointment, sourceAppointments) {
        for (let i = 0; i < sourceAppointments.length; i++) {
            const item = sourceAppointments[i];
            if (item.itemData === currentAppointment.itemData) {
                return item
            }
        }
        return null
    }
    _getDeletedAppointments(currentAppointments, sourceAppointments) {
        const result = [];
        for (let i = 0; i < sourceAppointments.length; i++) {
            const sourceAppointment = sourceAppointments[i];
            const currentAppointment = this._getAssociatedSourceAppointment(sourceAppointment, currentAppointments);
            if (!currentAppointment) {
                sourceAppointment.needRemove = true;
                result.push(sourceAppointment)
            }
        }
        return result
    }
    getRepaintedAppointments(currentAppointments, sourceAppointments) {
        if (0 === sourceAppointments.length || "agenda" === this.appointmentRenderingStrategyName) {
            return currentAppointments
        }
        currentAppointments.forEach((appointment => {
            const sourceAppointment = this._getAssociatedSourceAppointment(appointment, sourceAppointments);
            if (sourceAppointment) {
                const isDataChanged = this._isDataChanged(appointment.itemData);
                const isSettingChanged = this._isSettingChanged(appointment.settings, sourceAppointment.settings);
                const isAppointmentShouldAppear = this._isAppointmentShouldAppear(appointment, sourceAppointment);
                appointment.needRepaint = isDataChanged || isSettingChanged || isAppointmentShouldAppear
            }
        }));
        return currentAppointments.concat(this._getDeletedAppointments(currentAppointments, sourceAppointments))
    }
    getRenderingStrategyInstance() {
        const renderingStrategy = this.appointmentViewModel.getRenderingStrategy();
        if (!renderingStrategy) {
            const options = this._getRenderingStrategyOptions();
            this.appointmentViewModel.initRenderingStrategy(options)
        }
        return this.appointmentViewModel.getRenderingStrategy()
    }
}
export default AppointmentLayoutManager;