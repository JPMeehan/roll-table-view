const MODULE_ID = 'roll-table-view';

class RollTableView extends RollTableConfig {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['sheet', 'roll-table-view'],
      template: 'modules/roll-table-view/templates/roll-table-view.hbs',
    });
  }

  async getData(options = {}) {
    const context = await super.getData(options);

    for (const r of context.results) {
      const result = this.document.results.get(r._id);
      const rawText = result.getChatText();
      r.enrichedText = await TextEditor.enrichHTML(rawText);
    }

    return context;
  }
}

Hooks.once('init', () => {
  DocumentSheetConfig.registerSheet(RollTable, MODULE_ID, RollTableView, {
    label: 'RollTableView.SheetLabel',
  });
});
