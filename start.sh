#!/bin/bash
echo "set mongodb"
#export MONGO_URL="mongodb://worksUsername:worksPassword@192.168.100.192:14017/worksDatabase?authSource=admin"
#export MONGO_URL="mongodb://works:zheldjf@192.168.10.135:27017/works?authSource=works"
#export MONGO_URL="mongodb://worksUsername:worksPassword@asolution.iptime.org:27017/works?authSource=works&readPreference=primary&appname=MongoDB%20Compass&ssl=false"
export MONGO_URL="mongodb://worksUsername:worksPassword@asolution.iptime.org:27017/works?authSource=works"
echo "start meteor"
meteor

