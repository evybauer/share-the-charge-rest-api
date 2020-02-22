const util = require("util");
const Cloud = require("@google-cloud/storage");
const path = require("path");

const serviceKey = path.join(
  __dirname,
  "../../kubernetes-the-hard-way-241300-f9d7e59dd2ac.json"
);

const { Storage } = Cloud;

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "kubernetes-the-hard-way-241300"
});

const bucket = storage.bucket("share-the-charger-sam");

async function listFiles() {
  // Lists files in the bucket
  const [files] = await bucket.getFiles();

  console.log("Files:");
  files.forEach(file => {
    console.log(file.name);
  });
}

const { format } = util;

const uploadImage = file =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    // listFiles();

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false
    });

    blobStream
      .on("finish", () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on("error", e => {
        console.log(e);
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

module.exports = uploadImage;