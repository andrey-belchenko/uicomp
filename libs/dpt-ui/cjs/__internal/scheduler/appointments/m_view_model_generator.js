/**
 * DevExtreme (cjs/__internal/scheduler/appointments/m_view_model_generator.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppointmentViewModelGenerator = void 0;
var _date = require("../../core/utils/date");
var _index = require("../../scheduler/r1/utils/index");
var _m_strategy_agenda = _interopRequireDefault(require("./rendering_strategies/m_strategy_agenda"));
var _m_strategy_horizontal = _interopRequireDefault(require("./rendering_strategies/m_strategy_horizontal"));
var _m_strategy_horizontal_month = _interopRequireDefault(require("./rendering_strategies/m_strategy_horizontal_month"));
var _m_strategy_horizontal_month_line = _interopRequireDefault(require("./rendering_strategies/m_strategy_horizontal_month_line"));
var _m_strategy_vertical = _interopRequireDefault(require("./rendering_strategies/m_strategy_vertical"));
var _m_strategy_week = _interopRequireDefault(require("./rendering_strategies/m_strategy_week"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}
const RENDERING_STRATEGIES = {
    horizontal: _m_strategy_horizontal.default,
    horizontalMonth: _m_strategy_horizontal_month.default,
    horizontalMonthLine: _m_strategy_horizontal_month_line.default,
    vertical: _m_strategy_vertical.default,
    week: _m_strategy_week.default,
    agenda: _m_strategy_agenda.default
};
class AppointmentViewModelGenerator {
    initRenderingStrategy(options) {
        const RenderingStrategy = RENDERING_STRATEGIES[options.appointmentRenderingStrategyName];
        this.renderingStrategy = new RenderingStrategy(options)
    }
    generate(filteredItems, options) {
        const {
            viewOffset: viewOffset
        } = options;
        const appointments = filteredItems ? filteredItems.slice() : [];
        this.initRenderingStrategy(options);
        const renderingStrategy = this.getRenderingStrategy();
        const positionMap = renderingStrategy.createTaskPositionMap(appointments);
        const shiftedViewModel = this.postProcess(appointments, positionMap);
        const viewModel = this.unshiftViewModelAppointmentsByViewOffset(shiftedViewModel, viewOffset);
        return {
            positionMap: positionMap,
            viewModel: viewModel
        }
    }
    postProcess(filteredItems, positionMap) {
        const renderingStrategy = this.getRenderingStrategy();
        return filteredItems.map(((data, index) => {
            if (!renderingStrategy.keepAppointmentSettings()) {
                delete data.settings
            }
            const appointmentSettings = positionMap[index];
            appointmentSettings.forEach((item => {
                item.direction = "vertical" === renderingStrategy.getDirection() && !item.allDay ? "vertical" : "horizontal"
            }));
            const item = {
                itemData: data,
                settings: appointmentSettings
            };
            item.needRepaint = true;
            item.needRemove = false;
            return item
        }))
    }
    makeRenovatedViewModels(viewModel, supportAllDayRow, isVerticalGrouping) {
        const strategy = this.getRenderingStrategy();
        const regularViewModels = [];
        const allDayViewModels = [];
        const compactOptions = [];
        const isAllDayPanel = supportAllDayRow && !isVerticalGrouping;
        viewModel.forEach((_ref => {
            let {
                itemData: itemData,
                settings: settings
            } = _ref;
            settings.forEach((options => {
                const item = this.prepareViewModel(options, strategy, itemData);
                if (options.isCompact) {
                    compactOptions.push({
                        compactViewModel: options.virtual,
                        appointmentViewModel: item
                    })
                } else if (options.allDay && isAllDayPanel) {
                    allDayViewModels.push(item)
                } else {
                    regularViewModels.push(item)
                }
            }))
        }));
        const compactViewModels = this.prepareCompactViewModels(compactOptions, supportAllDayRow);
        const result = _extends({
            allDay: allDayViewModels,
            regular: regularViewModels
        }, compactViewModels);
        return result
    }
    prepareViewModel(options, strategy, itemData) {
        const geometry = strategy.getAppointmentGeometry(options);
        const viewModel = {
            key: (0, _index.getAppointmentKey)(geometry),
            appointment: itemData,
            geometry: _extends({}, geometry, {
                leftVirtualWidth: options.leftVirtualWidth,
                topVirtualHeight: options.topVirtualHeight
            }),
            info: _extends({}, options.info, {
                allDay: options.allDay,
                direction: options.direction,
                appointmentReduced: options.appointmentReduced,
                groupIndex: options.groupIndex
            })
        };
        return viewModel
    }
    getCompactViewModelFrame(compactViewModel) {
        return {
            isAllDay: !!compactViewModel.isAllDay,
            isCompact: compactViewModel.isCompact,
            groupIndex: compactViewModel.groupIndex,
            geometry: {
                left: compactViewModel.left,
                top: compactViewModel.top,
                width: compactViewModel.width,
                height: compactViewModel.height
            },
            items: {
                colors: [],
                data: [],
                settings: []
            }
        }
    }
    prepareCompactViewModels(compactOptions, supportAllDayRow) {
        const regularCompact = {};
        const allDayCompact = {};
        compactOptions.forEach((_ref2 => {
            let {
                compactViewModel: compactViewModel,
                appointmentViewModel: appointmentViewModel
            } = _ref2;
            const {
                index: index,
                isAllDay: isAllDay
            } = compactViewModel;
            const viewModel = isAllDay && supportAllDayRow ? allDayCompact : regularCompact;
            if (!viewModel[index]) {
                viewModel[index] = this.getCompactViewModelFrame(compactViewModel)
            }
            const {
                settings: settings,
                data: data,
                colors: colors
            } = viewModel[index].items;
            settings.push(appointmentViewModel);
            data.push(appointmentViewModel.appointment);
            colors.push(appointmentViewModel.info.resourceColor)
        }));
        const toArray = items => Object.keys(items).map((key => _extends({
            key: key
        }, items[key])));
        const allDayViewModels = toArray(allDayCompact);
        const regularViewModels = toArray(regularCompact);
        return {
            allDayCompact: allDayViewModels,
            regularCompact: regularViewModels
        }
    }
    getRenderingStrategy() {
        return this.renderingStrategy
    }
    unshiftViewModelAppointmentsByViewOffset(viewModel, viewOffset) {
        const processedAppointments = new Set;
        for (const model of viewModel) {
            for (const setting of model.settings ?? []) {
                var _setting$info;
                const appointment = null === setting || void 0 === setting || null === (_setting$info = setting.info) || void 0 === _setting$info ? void 0 : _setting$info.appointment;
                if (appointment && !processedAppointments.has(appointment)) {
                    appointment.startDate = _date.dateUtilsTs.addOffsets(appointment.startDate, [viewOffset]);
                    appointment.endDate = _date.dateUtilsTs.addOffsets(appointment.endDate, [viewOffset]);
                    appointment.normalizedEndDate = _date.dateUtilsTs.addOffsets(appointment.normalizedEndDate, [viewOffset]);
                    processedAppointments.add(appointment)
                }
            }
        }
        return viewModel
    }
}
exports.AppointmentViewModelGenerator = AppointmentViewModelGenerator;
