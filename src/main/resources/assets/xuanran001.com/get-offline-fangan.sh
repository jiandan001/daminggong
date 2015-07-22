#!/bin/bash

function hide_content
{
  sed -i '1i<style>#header { padding : 0px !important; } #header .container, #footer { display : none !important; } body { padding: 0px !important; }#toolbar, #drupal_tabs { display: none !important; } #paging { display: none; }</style>' "$1"
}

function absolute_path_to_relative_path
{
  sed -i "s/src=\"http:\/\/www\.xuanran001\.com\//src=\".\//g" $1
  sed -i "s/href=\"http:\/\/www\.xuanran001\.com\//href=\".\//g" $1
  sed -i "s/\"\/libs/\"\.\/libs/g" $1
  sed -i "s/\"\/sites/\"\.\/sites/g" $1
  sed -i "s/'\/sites/'\.\/sites/g" $1
  sed -i "s/\"\/public/\"\.\/public/g" $1
  sed -i "s/url(\/sites/url(.\/sites/g" $1
}

function get_zxfazzjfb3_html
{
  echo "[get_zxfazzjfb3_html] : $1"

  # http://www.xuanran001.com/rwrule/zxfazzjfb3/db205959-2872-482a-af66-f6672ceb543d.html"
  url="http://www.xuanran001.com/rwrule/zxfazzjfb3/${1}.html"
  # zxfazzjfb3_db205959-2872-482a-af66-f6672ceb543d.html
  fangan_html="zxfazzjfb3_${1}.html"

  echo "<li><a href=\"${fangan_html}\">$fangan_html</a></li>" >> list.html

  echo "download static file from $url"
  wget "$url" -O "$fangan_html" &> /dev/null

  absolute_path_to_relative_path "$fangan_html"
  hide_content "$fangan_html"

  # all text black color
  sed -i '1i<style>body, div, a, small { color: black !important; }</style>' "$fangan_html"

  # some changed requirement
  cat << EOF >> $fangan_html
<script>
jQuery(function() {
  jQuery("h1").css("margin-bottom", "90px");
  jQuery("#mobile-qr").append('<br><b style="font-size: 16px; line-height: 30px;">扫一扫，带走全景效果图。</b>');
  jQuery("td > a, th > a").each(function(i,k){
    if ( jQuery(k).html() == "点击查看" )
    {
      jQuery(k).attr("href", "${mddz_html}");
    }
    else
    {
      jQuery(k).removeAttr("href");
    }
  });
});
</script>
EOF

  # gaibaojia
  #echo "gaibaojia-start"
  #sed -i 's/原地面清理，贴墙砖采用国际325#水泥以1:3配放砂浆，单价含水泥砂浆、人工，主材另算（规格为300mm\*300mm至800mm\*800mm）水泥沙厚度5cm以内，超过5cm另加10元\/平方米，斜铺另加8元\/平方 ，拼花另加30元\/平方米。/1、清理基层，扫除浮灰，洒水润湿；2、预排、放样，水泥砂浆铺贴；3、不含踢脚板安装、不含特殊基层处理、瓷砖规格：大于等于600mm小于等于800mm/g' "$fangan_html"
  #echo "gaibaojia-end"

  if [ $download_data = "1" ]; then

    # get swf
    # public/repository/108e/d900/8282/47d5/9597/a7c6/7b90/2938/swf
    swf_path=`grep -Po '(?<="imagePath":")[^"]*' "$fangan_html" | grep "swf" | sed -e 's/\\\//g' | sed -e 's/\///' | sed -e 's/\/0000.swf//'`
    echo "swf path : $swf_path"
    mkdir -p $swf_path
    wget "http://www.xuanran001.com/$swf_path/0000.swf" -O "$swf_path/0000.swf" &> /dev/null

    # get static file in /public
    mkdir -p tmp
    cd tmp
    wget -r -p -np -k "$url" &> /dev/null
    cp -rf www.xuanran001.com/public ../
    cd ..
    rm -rf tmp

  fi
}

function get_mendiandizhi_html
{
  wget "http://www.xuanran001.com/usercenter/wodefangan4/bianjifangan/mendiandizhi.html?sid=db205959-2872-482a-af66-f6672ceb543d&id=688e1843-8b28-405b-b805-211df3f55d23" -O "$mddz_html" &> /dev/null

  hide_content "$mddz_html"
  absolute_path_to_relative_path "$mddz_html"

  # ajaxform will append "?" at the end of URI when request type is GET.
  sed -i "/_charset_/d" "$mddz_html"
  sed -i "/type:\ \"GET\",/d" "$mddz_html"
  sed -i "s/url,/DATA_URI,/" "$mddz_html"

  cat << 'EOF' >> $mddz_html
<script>
function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}
DATA_JSON = hereDoc(function() {/*!
{
  "State": 200,
  "Time": 408,
  "ModelName": "东鹏瓷砖-FG805301-云海玉",
  "Success": true,
  "Result": [
EOF

  mddz_name="北大明宫家居城商户信息"
  soffice  --headless --convert-to txt:text "../../../../../attachment/西安大明宫现合作商户信息/${mddz_name}.doc"
  sed -i '1d' "${mddz_name}.txt"
  sed -i '/^$/d' "${mddz_name}.txt"
  awk -F咨询电话： '{print "{\"name\":\""$1"\",\"tel\":\""$2"\",\"addr\":\""$1"\",\"id\":\"\"},"}' "${mddz_name}.txt" >> $mddz_html
  sed -i '$ s/,$//' $mddz_html

  # line count
  count=`wc -l "${mddz_name}.txt" | sed "s/${mddz_name}\.txt//"`

  # clear temp text
  rm "${mddz_name}.txt"

  cat << EOF >> $mddz_html
  ],
  "Count": $count,
  "BrandName": "东鹏瓷砖",
  "Candel": false
}
*/});
DATA_URI = 'data:application/json;charset=utf-8,' + encodeURIComponent(DATA_JSON);
</script>
EOF
}

download_data="0"

mddz_html="mendiandizhi.html"

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
  get_zxfazzjfb3_html "$uuid"
done

get_mendiandizhi_html
