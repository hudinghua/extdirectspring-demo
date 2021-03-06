Ext.Loader.setConfig({
	enabled: true
});

Ext.require([ 'Ext.grid.*', 'Ext.data.*' ]);

Ext.onReady(function() {
	Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

	Ext.define('Person', {
		extend: 'Ext.data.Model',
		fields: [ 'lastName', 'firstName', 'id', 'street', 'city', 'state', 'zip' ],
		proxy: {
			type: 'direct',
			api: {
				read: person4Action.load,
				create: person4Action.create,
				update: person4Action.update,
				destroy: person4Action.destroy
			}
		}
	});

	Ext.define('State', {
		extend: 'Ext.data.Model',
		fields: [ 'state' ],
		proxy: {
			type: 'direct',
			directFn: person4Action.getStates
		}
	});

	var store = Ext.create('Ext.data.Store', {
		autoDestroy: true,
		model: 'Person',
		autoLoad: true
	});

	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
		clicksToMoveEditor: 1,
		autoCancel: false
	});

	var grid = Ext.create('Ext.grid.Panel', {
		store: store,
		columns: [ {
			header: 'Last Name',
			dataIndex: 'lastName',
			flex: 1,
			editor: {
				allowBlank: false
			}
		}, {
			header: 'First Name',
			dataIndex: 'firstName',
			flex: 1,
			editor: {
				allowBlank: false
			}
		}, {
			header: 'Street Address',
			dataIndex: 'street',
			flex: 1,
			editor: {
				allowBlank: true
			}
		}, {
			header: 'City',
			dataIndex: 'city',
			width: 150,
			editor: {
				allowBlank: true
			}
		}, {
			header: 'State',
			dataIndex: 'state',
			width: 80,
			editor: {
				allowBlank: false,
				xtype: 'combobox',
				displayField: 'state',
				valueField: 'state',
				store: Ext.create('Ext.data.Store', {
					autoLoad: true,
					model: 'State'
				})
			}
		}, {
			header: 'Zip Code',
			dataIndex: 'zip',
			editor: {
				allowBlank: true
			}
		} ],
		renderTo: Ext.getBody(),
		width: 1000,
		height: 400,
		title: 'Persons',
		frame: true,
		tbar: [ {
			text: 'Add Person',
			iconCls: 'employee-add',
			handler: function() {
				rowEditing.cancelEdit();

				// Create a record instance through the ModelManager
				var r = Ext.ModelManager.create({
					lastName: 'New',
					firstName: 'Person',
					street: 'Street',
					city: 'City',
					state: 'State',
					zip: 'Zip'
				}, 'Person');

				store.insert(0, r);
				rowEditing.startEdit(0, 0);
			}
		}, {
			itemId: 'removePerson',
			text: 'Remove Person',
			iconCls: 'employee-remove',
			handler: function() {
				var sm = grid.getSelectionModel();
				rowEditing.cancelEdit();
				store.remove(sm.getSelection());
				if (store.getCount() > 0) {
					sm.select(0);
				}
			},
			disabled: true
		}, '->', {
			text: 'Sync',
			handler: function() {
				store.sync();
			}
		} ],
		plugins: [ rowEditing ],
		listeners: {
			'selectionchange': function(view, records) {
				grid.down('#removePerson').setDisabled(!records.length);
			}
		}
	});

});