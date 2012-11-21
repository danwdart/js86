var Cookies = {
  getItem: function (sKey) {
    if (!sKey || !this.hasItem(sKey)) { return null; }
    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
  },
  setItem: function (sKey, sValue) {
    document.cookie = escape(sKey) + "=" + escape(sValue);
  },
  removeItem: function (sKey, sPath) {
    if (!sKey || !this.hasItem(sKey)) { return; }
    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  }
};

$(document).ready(function() {
	if(Cookies.hasItem('code')) {
		$('#code').val(Cookies.getItem('code'));
	}
	$('#run').click(function() {
		run();
	});
});

function run() {
	strCode = $('#code').val();
	Cookies.setItem('code', strCode);
	strScreen = $('#screen').val();
	lines = strCode.split("\n");

	$.each(lines, function(n, line) {
		runline(line);
	});

	$('#screen').val(strScreen);
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;
}

function getreg(strName) {
	return parseInt($('#'+strName).html());
}

function setreg(name, num, dig, auto) {
	if('undefined' == typeof dig) {
		dig = 4;
	}
	$('#'+name).html('0x'+pad(num.toString(16), dig));

	if(auto == true) {
		return;
	}

	switch(name) {
		case 'ax':
			setreg('ah', (num & 0xff00) >> 8, 2, true);
			setreg('al', num & 0x00ff, 2, true);
			break;
		case 'al':
			setreg('ax', getreg('ax') | num, true);
			break;
		case 'ah':
			setreg('ax', getreg('ax') | (num << 8), true);
			break;
		case 'bx':
			setreg('ah', num >> 0x100, 2, true);
			setreg('al', num % 0x100, 2, true);
			break;
		case 'cx':
			setreg('ah', num >> 0x100, 2, true);
			setreg('al', num % 0x100, 2, true);
			break;
		case 'dx':
			setreg('ah', num >> 0x100, 2, true);
			setreg('al', num % 0x100, 2, true);
			break;
		default:
	}
}

function runline(line) {
	arrCommand = line.split(' ');
	op = arrCommand[0].toLowerCase();
	switch(op) {
		case 'mov':
			if(arrCommand[2].isNumber()) {
				setreg(arrCommand[1], arrCommand[2]);
			} else {
				setreg(arrCommand[1], getreg(arrCommand[2]));
			}
			break;
		case 'add':
			setreg(arrCommand[1], parseInt(arrCommand[2]) + parseInt(getreg(arrCommand[1])));
			break;
		default:
			alert('Unsupported command: '+op);
	}
}