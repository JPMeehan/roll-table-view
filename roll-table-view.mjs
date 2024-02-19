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

  activateListeners(html) {
    // Nice table image view
    html.on('click', '.result-image img', (event) => {
      const img = event.currentTarget;
      const li = img.closest('.table-result');
      const result = this.document.results.get(li.dataset.resultId);
      const ip = new ImagePopout(img.src, {
        title: game.i18n.localize('DOCUMENT.TableResult'),
        uuid: result.uuid,
      });
      ip.render(true);
    });

    super.activateListeners(html);
  }
}

Hooks.once('init', () => {
  DocumentSheetConfig.registerSheet(RollTable, MODULE_ID, RollTableView, {
    label: 'RollTableView.SheetLabel',
  });
});
