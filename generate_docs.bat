:: npm install -g jsdoc
:: npm install ink-docstrap
rm -R docs
call jsdoc -c ./conf.json ./../LazyLinks/Readme.md

cd docs
mklink /j docs .\..\..\LazyLinks\docs
mklink /j Greasemonkey .\..\..\LazyLinks\Greasemonkey

:: docker -i iMacros -o docs