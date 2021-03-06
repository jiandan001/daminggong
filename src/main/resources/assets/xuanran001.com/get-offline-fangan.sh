#!/bin/bash

function hide_content
{
  sed -i '1i<style>#header { padding : 0px !important; } #header .container, #footer { display : none !important; } body { padding: 0px !important; }#toolbar, #drupal_tabs { display: none !important; } #paging { display: none; }</style>' "$1"
}

function set_font_color_black
{
  sed -i '1i<style>body, div, a, small { color: black !important; }</style>' "$1"
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

function xuqiubiandong
{
  fangan_html="$1"
  # some changed requirement
  cat << EOF >> $fangan_html
<script>
function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}
ZIDINGYI_HTML = hereDoc(function() {/*!
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion-sgBill" href="#sgBill-自定义">
                        家装公司自定义工程
                        <small class="pull-right">(温馨提示:此项为家装公司增项内容，请咨询该装修公司)</small>
                    </a>
                </h4>
            </div>
            <div id="sgBill-自定义" class="panel-collapse collapse">
                <div class="panel-body">
                    <p class="text-center"><pre>
1).水泥砂浆找平，每平方30元；
2).贴石膏线，每米15元；
3).石膏板隔墙，单面每平方80元，双面每平方110元；
4).基层铲除，每平方6元；
5).门窗拆除，一樘50元；
6).新建隔墙，每平方140元；
7).旧房瓷砖铲除，每平方35元；
8).底盒安装，每个8元。</pre>
                  </p>
                </div>
            </div>
        </div>
*/});
jQuery(function() {
  jQuery("h1").css("margin-bottom", "90px");
  jQuery("#mobile-qr").append('<br><b style="font-size: 16px; line-height: 30px;">扫一扫，带走全景效果图。</b>');
  jQuery("td > a, th > a").each(function(k, v){
    if ( jQuery(v).html() == "点击查看" )
    {
      jQuery(v).attr("href", "${mddz_html}");
    }
    else
    {
      jQuery(v).removeAttr("href");
    }
  });
  jQuery(".panel.panel-default").each(function(k, v) {
    var div = jQuery(v);
    if( div.find("a").attr("href") == "#sgBill-水电及其安装与杂项其他" )
    {
      jQuery(ZIDINGYI_HTML).insertAfter(div);
    }
  });
});
</script>
EOF

  # gaibaojia
  sed -i 's/包含墙面找平、贴布刷基膜等清理基层工序，满刮两遍腻子，厚度3mm以内，每次刮腻子厚度不超过1mm，用砂纸打磨。批灰后内墙底漆一遍，内墙乳胶漆两遍。/1、含墙面批刮腻子；2、墙面清理干净，无浮尘；3、刮腻子2-3遍，砂纸打磨平整；4、阴阳角顺直；5、清理原墙面浮灰，滚涂乳胶漆，乳胶漆甲方提供。/g' "$fangan_html"
  sed -i 's/包含顶面找平、贴布刷基膜等清理基层工序，满刮两遍腻子，厚度3mm以内，每次刮腻子厚度不超过1mm，用砂纸打磨。批灰后内墙底漆一遍，内墙乳胶漆两遍。/1、含墙面批刮腻子；2、墙面清理干净，无浮尘；3、刮腻子2-3遍，砂纸打磨平整；4、阴阳角顺直；5、清理原墙面浮灰，滚涂乳胶漆，乳胶漆甲方提供。/g' $fangan_html
  sed -i 's/原地面清理，贴墙砖采用国际325#水泥以1:3配放砂浆，单价含水泥砂浆、人工，主材另算（规格为300mm\*300mm至800mm\*800mm）水泥沙厚度5cm以内，超过5cm另加10元\/平方米，斜铺另加8元\/平方 ，拼花另加30元\/平方米。/1、清理基层，扫除浮灰，洒水润湿；2、预排、放样，水泥砂浆铺贴；3、不含踢脚板安装、不含特殊基层处理、瓷砖规格：大于等于600mm小于等于800mm/g' $fangan_html
  sed -i 's/包含墙面找平、贴布刷基膜等清理基层工序，贴墙砖采用国际325#水泥以1:3配放砂浆，单价含水泥砂浆、人工，主材另算。/1、瓷砖充分泡水，取出阴干；2、清理基层，扫除浮灰、洒水润湿；3、预排、放样、水泥砂浆铺贴；4、不含踢脚线安装、不含特殊基层处理、瓷砖规格：大于等于300mm小于等于600mm。/g' $fangan_html
  sed -i 's/水泥防水材料，按HD乳液胶：水泥=1：（0.6~0.8）地面刷三遍墙面刷两遍，干后闭水实验24—48小时，以不漏水为标准。/1、如果作业面基层平整度较差，表面疏松，必须做基层界面处理；2、清理基层，无浮灰，涂刷防水涂料2遍，第二遍涂刷方向与第一遍涂刷方向垂直；3、卫生间涂刷高度从地面上返1800mm，厨房涂刷高度从地面上返300mm；4、防水涂刷完全干透后，地面蓄水，墙面淋水做24小时闭水实验；5、按实际涂刷面积计算工程量。（防水品牌：东方雨虹）/g' $fangan_html
  sed -i 's/造型吊顶：采用3\*4木龙骨架，石膏板封面，无多层夹板，具体装修设计图纸。集成吊顶：使用30\*30mm木枋、305\*305mm间距木方格。定线制作安装：打水平线，挂线，膨胀螺丝固定拉杆吊巾，使木枋格水平；9mm夹板底,3mm铝扣板面用万能胶粘络脉（不含防火漆，防虫剂，含络缝扫漆。）/1、固定吊顶木龙骨（轻钢龙骨）做骨架，规范安装配件；2、封石膏板，自攻丝固定，外漏螺帽使用防锈漆点凃；3、石膏板缝批八字缝并使用嵌缝石膏填补，并贴绷带做防开裂处理；4、拐角处使用整板套割，不拼接，不开裂；5、大面积吊顶使用轻钢龙骨，小面积吊顶使用木龙骨。（石膏板品牌：泰山）/g' $fangan_html
  sed -i 's/明线35元\/m；暗线45元\/m；混凝土50元\/m。/明线35元\/m；暗线45元\/m；1、确定终端位置，弹线布管，管道走向横平竖直；2、管道安装支架固定，支架间距0\.8-1m，固定牢固；3、管道连接使用规格相同直接、弯头等连接件；4、线管弯曲使用弯簧，月亮弯，严禁损毁线管；5、电线穿线规范，不同电压、不同用途电线严禁同管，管道内无接头；6、厨卫电器单独回路；7、工程施工完毕由监理验收合格后才能进行后续施工。（线管品牌：伟星\/鸽牌，电线品牌：海燕\/鸽牌)/g' $fangan_html
  sed -i 's/明管50元\/m；暗管60元\/m；混凝土80元\/m。/明管45元\/m；暗管55元\/m；1、确定终端位置，弹线布管，管道走向横平竖直；2、管道安装支架固定，支架间距0\.8-1m，固定牢固；3、管道焊接操作规范，稳定合适；4、管道安装完毕，注水，确保无堵塞；5、使用打压机，打压机维持6-8mpa，30分钟，管道接头无渗漏，压降不超过0\.5mpa；6、工程施工完毕由监理验收合格后才能进行后续施工。 （水管品牌：伟星\/鸽牌)/g' $fangan_html
  sed -i 's/成品石膏线条铺贴。（含石膏线条、辅料及人工费。）/1、普通合资石膏线60~100mm宽石膏素线，快贴粉粘贴，木质基层用枪钉固定；2、宽度每增加20mm，加收3元\/m\./g' $fangan_html
#  sed -i 's/<th>墙面乳胶漆处理<\/th>\
#\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ <td>㎡<\/td>\
#\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ <td>\(.*\)<\/td>\
#\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ <td>35<\/td>/<th>墙面乳胶漆处理<\/th>\
#\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ <td>㎡<\/td>\
#\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ <td>\1<\/td>\
#\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ <td>28<\/td>/g' $fangan_html
  #sed -i 's///g' $fangan_html
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

  if [ $download_data != "1" ]; then
    return 0
  fi

  # get static file in /public
  mkdir -p tmp
  cd tmp
  wget -r -p -np -k "$url" &> /dev/null
  cp -rf www.xuanran001.com/public ../
  cd -
  rm -rf tmp

  # get swf
  # public/repository/108e/d900/8282/47d5/9597/a7c6/7b90/2938/swf
  swf_path=`grep -Po '(?<="imagePath":")[^"]*' "$fangan_html" | grep "swf" | sed -e 's/\\\//g' | sed -e 's/\///' | sed -e 's/\/0000.swf//'`
  echo "swf path : $swf_path"
  mkdir -p $swf_path
  wget "http://www.xuanran001.com/$swf_path/0000.swf" -O "$swf_path/0000.swf" &> /dev/null
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

  if [ $1 = "debug" ]; then
    return 0
  fi

  mddz_name="${1}商户信息"
  soffice --headless --convert-to txt:Text "../../../../../attachment/西安大明宫现合作商户信息/${mddz_name}.doc"
  sed -i '1d' "${mddz_name}.txt"
  sed -i '/^\s*$/d' "${mddz_name}.txt"
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

#region="debug"
#region="default"
region="北大明宫家居城"
#region="北大明宫批发商城"
#region="南大明宫家居城"
#region="西大明宫家居城"

if [ $region = "debug" ]; then
  # just debug
  uuids=(
  319ae1b9-c0e7-4e49-a8fd-f2413be2925d
  )
elif [ $region = "default" ]; then
  #default
  uuids=(
  db205959-2872-482a-af66-f6672ceb543d
  a27bd4c6-3421-4a81-b998-18cdf3257fce
  b0f6cd2a-2f04-4d8f-abee-89231be7b353
  691e0b13-d06f-43a8-8543-b228585fb16c
  722ccf61-7716-4001-9f24-fcdaafc1b8ac
  4a503fcb-8491-42b4-8ff1-ea79744aa811
  )
elif [ $region = "南大明宫家居城" ]; then
  #south
  uuids=(
  319ae1b9-c0e7-4e49-a8fd-f2413be2925d
  2e3a8215-8935-419f-a0ad-58271ccf0eb9
  61d40a43-d282-4838-a301-0f4e55a3e911
  06626f62-5f4a-4cde-aca2-5489e14b050e
  10988ded-7125-4160-9bbc-fc37a04c7ae5
  f0d50450-216c-4d50-847b-951fb0a16a2d
  2b30f69f-a09b-4b32-88b5-6ff57b3053fa
  2eece5b3-0d01-4e59-ac4e-fedd7da9d61f
  c5f18502-e0da-4cfd-845e-d64312e0f0ea
  )
elif [ $region = "北大明宫家居城" ]; then
  #north
  uuids=(
  19597e49-9191-482a-ac38-db752a2510e0
  96aef0a4-c51e-4172-9e4a-165ca9c57eed
  7dd5d070-b8cf-469a-b8fc-044381b24136
  aca84b1c-d78b-44c5-b3da-9761fadee7dd
  5a35299d-6090-4ca0-91b4-62c4f3dd71d8
  26379721-9ad6-4e05-a253-fbecef48b9ee
  5e5dba4c-37c0-4ba5-91f6-7b1b6d5e8628
  bd1a2d85-f69d-473c-902a-83755802f2e5
  )
fi

echo "" > list.html

for uuid in "${uuids[@]}"
do
  fangan_html="zxfazzjfb3_${uuid}.html"
  get_zxfazzjfb3_html "$uuid"

  absolute_path_to_relative_path "$fangan_html"
  hide_content "$fangan_html"
  set_font_color_black "$fangan_html"
  xuqiubiandong "$fangan_html"

done

get_mendiandizhi_html "$region"
