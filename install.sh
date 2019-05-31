set -e
#Install all libs!
echo "Installing..."
npm install express --save
npm install request
npm install mysql
npm install cors
#or you can use npm install if you have the package.json file btw
echo "Install completed!!"
read -p "Press any key..."