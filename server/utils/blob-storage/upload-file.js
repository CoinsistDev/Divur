import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';

// Azure storage account credentials
const account = process.env.STORAGE_ACCOUNT_NAME;
const accountKey = process.env.STORAGE_KEY;
const containerName = process.env.CONTAINER_NAME;
const expiresInHours = 3; // Set the expiry time in hours

// Connect to the storage account
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);

// Upload file from buffer to storage
export async function uploadFileFromBuffer(fileName, buffer) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  
  const res = await blockBlobClient.uploadData(buffer);
  //   console.log(res);
  console.log("File uploaded successfully!");
}

// Generate shared access signature (SAS) token for the blob with limited time access
function generateSasToken(blobClient, expiresInHours) {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + expiresInHours); // Set expiry time

  const permissions = BlobSASPermissions.parse("r"); // Set permissions to read-only
  const sasOptions = {
    containerName : containerName,
    expiresOn: expiryDate,
    permissions: permissions.toString(),
  };
  const sasToken = generateBlobSASQueryParameters(sasOptions, blobClient.credential).toString();
  return `?${sasToken}`;
}


// Get download link for a file
export function getFileDownloadLink( fileName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  
  const sasToken = generateSasToken(blockBlobClient, expiresInHours);
  const downloadLink = blockBlobClient.url + sasToken;

  return downloadLink;
}
