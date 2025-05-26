ts: 
	npx tsc

clean: 
	rm -rf ./dist

_cp_packages:
	cp ./package.json ./dist/package.json
	cp ./package-lock.json ./dist/package-lock.json

_cp_dependencies:
	cp -rf ./node_modules ./dist/node_modules
	
zip:
	rm -rf ./lambda_function_payload.zip
	# // need to zip al root files in dist to a zip file named ./lambda_function_payload.zip.
	cd dist && zip -r ../lambda_function_payload.zip ./*

build: 
	make clean
	make ts
	make _cp_packages
	make _cp_dependencies