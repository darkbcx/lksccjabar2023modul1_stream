tsc
rm -rf ./dist/node_modules
rm files.zip
cp -R node_modules dist/node_modules
cd ./dist/
zip -r ../files.zip *
cd ..
aws lambda update-function-code --function-name daniel-os-lambda-trigger --zip-file fileb://./files.zip --profile cokodidi