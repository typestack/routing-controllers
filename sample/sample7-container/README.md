# Controllers.ts sample #7

## How To Run

1. Install npm dependencies:

    `npm install`

2. Install tsd dependencies:

    `tsd install`
    
3. Install Inversify typings

    `tsd install inversify`
    
4. Install the repository code over the npm version:

    `cd ../../`
    
    `npm run package`
    
    `cp ./build/package/* ./sample/sample7-container/node_modules/controllers.ts/ -r`
    
    `cd sample/sample7-container/`

5. Link tsd dependencies:

    `tsd link`

6. Run application

    `npm start`

7. Open browser (or use curl) to check if your app is working:

    <a href="http://localhost:3001/respond/">http://localhost:3001/respond/</a>
