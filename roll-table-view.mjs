const MODULE_ID = 'roll-table-view';

class RollTableView extends RollTableConfig {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['sheet', 'roll-table-view'],
      template: 'modules/roll-table-view/templates/roll-table-view.hbs',
    });
  }
}

Hooks.once('init', () => {
  DocumentSheetConfig.registerSheet(RollTable, MODULE_ID, RollTableView, {
    label: 'RollTableView.SheetLabel',
  });
});
