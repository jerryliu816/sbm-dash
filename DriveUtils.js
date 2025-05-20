function getIepFolder() {
  const folders = DriveApp.getFoldersByName("iep");
  return folders.hasNext() ? folders.next() : DriveApp.createFolder("iep");
}

function getUserFiles() {
  const folder = getIepFolder();
  const files = folder.getFilesByType(MimeType.PDF);
  const result = [];

  while (files.hasNext()) {
    const f = files.next();
    result.push({ id: f.getId(), name: f.getName() });
  }

  Logger.log(`Found ${result.length} PDF(s) in 'iep' folder.`);
  return result;
}

