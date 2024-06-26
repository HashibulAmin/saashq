module.exports = {
  srcDir: __dirname,
  name: 'forms',
  port: 3005,
  scope: 'forms',
  exposes: {
    './routes': './src/routes.tsx',
    './segmentForm': './src/segmentForm.tsx',
    './importExportUploadForm': './src/components/ColumnChooser',
    './fieldPreview': './src/components/FieldsPreview',
    './formPreview': './src/containers/FieldForm',
    './contactDetailLeftSidebar': './src/containers/CustomFieldsSection',
    './relationForm': './src/containers/RelationForm.tsx'
  },
  routes: {
    url: 'http://localhost:3005/remoteEntry.js',
    scope: 'forms',
    module: './routes'
  },
  relationForm: './relationForm',
  segmentForm: './segmentForm',
  formPreview: './formPreview',
  fieldPreview: './fieldPreview',
  importExportUploadForm: './importExportUploadForm',
  contactDetailLeftSidebar: './contactDetailLeftSidebar',
  menus: [
    {
      text: 'Vlastnosti',
      to: '/settings/properties',
      image: '/images/icons/saashq-01.svg',
      location: 'settings',
      scope: 'forms',
      action: 'formsAll',
      permissions: ['showForms', 'manageForms']
    }
  ]
};
