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
        width: 400,
        height: 'auto',
      });
      ip.render(true);
    });

    ContextMenu.create(this, html, 'tbody .table-result', this.tableResultMenu);

    super.activateListeners(html);
  }

  get tableResultMenu() {
    const getResult = ([target]) => {
      return this.document.results.get(target.dataset.resultId);
    };

    return [
      {
        name: game.i18n.format('DOCUMENT.Update', {
          type: game.i18n.localize('DOCUMENT.TableResult'),
        }),
        icon: "<i class='fas fa-edit'></i>",
        condition: (target) =>
          getResult(target).type === CONST.TABLE_RESULT_TYPES.TEXT,
        callback: (target) => getResult(target).sheet.render(true),
      },
    ];
  }
}

class TableResultEdit extends DocumentSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['sheet', 'table-result-edit'],
      template: 'modules/roll-table-view/templates/table-result-edit.hbs',
      width: 400,
    });
  }
}

Hooks.once('init', () => {
  DocumentSheetConfig.registerSheet(RollTable, MODULE_ID, RollTableView, {
    label: 'RollTableView.SheetLabel',
  });
  DocumentSheetConfig.registerSheet(TableResult, MODULE_ID, TableResultEdit, {
    label: 'RollTableView.ResultSheetLabel',
  });
});
