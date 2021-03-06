function getData() {
    var nowSourceData = sourceData;
    if(localStorage.getItem('newSourceData')) {
        var newSourceData = JSON.parse(localStorage.getItem('newSourceData'));
        for (var i = 0; i < newSourceData.length; i++) {
            for (var j = 0; j < nowSourceData.length; j++) {
                if (newSourceData[i].product === nowSourceData[j].product && newSourceData[i].region === nowSourceData[j].region) {
                    nowSourceData[j] = newSourceData[i];
                }
            }
        }
    }

    for (var inputs1 = [], i = 1; i < (region.childElementCount - 2); i += 2) {
        if (region.children[i].checked) {
            inputs1.push(region.children[i]);
        }
    }
    for (var inputs2 = [], i = 1; i < (product.childElementCount - 2); i += 2) {
        if (product.children[i].checked) {
            inputs2.push(product.children[i]);
        }
    }    
    for (var i = 0, datas = [], rawDatas = []; i < inputs2.length; i++) {
        for (var j = 0; j < inputs1.length; j++) {
            var arr = [inputs2[i].value, inputs1[j].value];
            for (var k = 0; k < nowSourceData.length; k++) {
                if (nowSourceData[k].region === inputs1[j].value && nowSourceData[k].product === inputs2[i].value){
                    datas.push(arr.concat(nowSourceData[k].sale));
                    rawDatas.push(nowSourceData[k].sale);
                }
            }
        }
    }
    return [datas, rawDatas];
}

function newTable(data) {
    for (var count1 = 0, i = 1; i < (region.childElementCount - 2); i += 2) {
        if (region.children[i].checked) {
            count1++;
        }
    }
    for (var count2 = 0, j = 1; j < (product.childElementCount - 2); j += 2) {
        if (product.children[j].checked) {
            count2++;
        }
    }       

    if (count1 && count2) {
        var count = count1 > count2 ? count1 : count2;
        var ths = ['商品', '地区', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        if (count1 < count2 && count1 === 1) {
            ths[0] = '地区';
            ths[1] = '商品';
            for (var i = 0; i < data[0].length; i++) {
                temp = data[0][i][0];
                data[0][i][0] = data[0][i][1];
                data[0][i][1] = temp;
            }
        }        
        var tr = document.createElement('tr');
        table.appendChild(tr);
        for (var i = 0; i < ths.length; i++) {
            var th = document.createElement('th');
            th.textContent = ths[i];
            th.setAttribute('scope', 'col');
            tr.appendChild(th);
        }
        for (var i = 0, k = 0; i < data[0].length; i++) {
            var tr = document.createElement('tr');
            table.appendChild(tr);
            tr.setAttribute('class', data[0][i][0] + data[0][i][1])
            for (var j = 0; j < data[0][i].length; j++) {
                var td = document.createElement('td');
                tr.appendChild(td);
                if (!isNaN(data[0][i][j])) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'text');
                    input.value = data[0][i][j];
                    td.appendChild(input);
                } else {
                    td.textContent = data[0][i][j];
                }
                if (j === 0) {
                    if ( k === 0 || k === count || k === 2 * count) {
                        if (count1 === 2 && count2 === 3) {
                            count = 2;
                            td.setAttribute('rowspan', count);
                        } else {
                            td.setAttribute('rowspan', count);
                        }
                        k++;
                    } else {
                        td.remove();
                        k++;
                    }
                }
            }    
        }
        line.setDataAll(data[1]);
    }

    var trs = document.querySelectorAll('tr');
    for (var i = 1; i < trs.length; i++) {
        trs[i].addEventListener('mouseover', function(e) {
            canvas.height = canvas.height;
            var svg = document.querySelector('svg');
            svg.textContent = '';
            var inputs = this.querySelectorAll('input');
            for (var j = 0, rawData = []; j < inputs.length; j++) {
                rawData.push(inputs[j].value);
            }
            line.draw();
            line.setData(rawData);
            bar.draw();
            bar.setData(rawData);
        });
        trs[i].addEventListener('mouseout', function(e) {
            canvas.height = canvas.height;
            line.draw();
            line.setDataAll(data[1]);
        });        
    }
    rawDatasCopy = data[1];
}