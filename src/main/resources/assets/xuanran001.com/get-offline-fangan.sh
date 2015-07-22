#!/bin/bash

function get_one
{
  echo "get_one : $1"
  url="http://www.xuanran001.com/rwrule/zxfazzjfb3/${1}.html"

  fangan_html="zxfazzjfb3_${1}.html"

  echo "<li><a href=\"${fangan_html}\">$fangan_html</a></li>" >> list.html

  echo "download static file from $url"
  wget "$url" -O "$fangan_html" &> /dev/null

  # hide footer and header
  sed -i '1i<style>#header { padding : 0px !important; }#header .container, #footer { display : none !important; }body { padding: 0px !important; }#toolbar, #drupal_tabs { display: none !important; } body, div, a, small { color: black !important; }</style>' "$fangan_html"

  # gaibaojia
  echo "gaibaojia-start"
  sed -i 's/原地面清理，贴墙砖采用国际325#水泥以1:3配放砂浆，单价含水泥砂浆、人工，主材另算（规格为300mm\*300mm至800mm\*800mm）水泥沙厚度5cm以内，超过5cm另加10元\/平方米，斜铺另加8元\/平方 ，拼花另加30元\/平方米。/1、清理基层，扫除浮灰，洒水润湿；2、预排、放样，水泥砂浆铺贴；3、不含踢脚板安装、不含特殊基层处理、瓷砖规格：大于等于600mm小于等于800mm/g' "$fangan_html"
  echo "gaibaojia-end"

  # get swf
  # public/repository/108e/d900/8282/47d5/9597/a7c6/7b90/2938/swf
  #swf_path=`curl "http://www.xuanran001.com/d/xanonymous?path=projects/schemeRoomList/id_${1}/test_1" 2> /dev/null | grep -Po '(?<="bigImg":")[^"]*' | grep "swf" | sed -e 's/\\\//g' | sed -e 's/\///' | sed -e 's/\/0000.swf//'`
  swf_path=`grep -Po '(?<="imagePath":")[^"]*' "$fangan_html" | grep "swf" | sed -e 's/\\\//g' | sed -e 's/\///' | sed -e 's/\/0000.swf//'`
  echo "swf path : $swf_path"
  mkdir -p $swf_path
  wget "http://www.xuanran001.com/$swf_path/0000.swf" -O "$swf_path/0000.swf" &> /dev/null

  mkdir -p tmp
  cd tmp
  wget -r -p -np -k "$url" &> /dev/null
  cp -rf www.xuanran001.com/public ../
  cd ..
  rm -rf tmp
}

uuids=(
db205959-2872-482a-af66-f6672ceb543d
a27bd4c6-3421-4a81-b998-18cdf3257fce
b0f6cd2a-2f04-4d8f-abee-89231be7b353
691e0b13-d06f-43a8-8543-b228585fb16c
722ccf61-7716-4001-9f24-fcdaafc1b8ac
4a503fcb-8491-42b4-8ff1-ea79744aa811
)

#uuids=(
#db205959-2872-482a-af66-f6672ceb543d
#)

echo "" > list.html

for uuid in "${uuids[@]}"
do
  get_one "$uuid"
done

sed -i "s/src=\"http:\/\/www\.xuanran001\.com\//src=\".\//g" zxfazzjfb3_*
sed -i "s/\"\/libs/\"\.\/libs/g" zxfazzjfb3_*
sed -i "s/\"\/sites/\"\.\/sites/g" zxfazzjfb3_*
sed -i "s/'\/sites/'\.\/sites/g" zxfazzjfb3_*
sed -i "s/\"\/public/\"\.\/public/g" zxfazzjfb3_*
sed -i "s/url(\/sites/url(.\/sites/g" zxfazzjfb3_*
