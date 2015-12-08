# 代码规范

## 通用规范

0. 需启用行宽，将每行代码宽度限制在 80，不超过 100

        # Sublime Text 可以这样配置行宽
        "rulers":
        [
            80,
            100
        ]


1. 使用 UTF8 编码 (可通过 EditorConfig 配置)

2. 确保文件末尾以空行结束 (可通过 EditorConfig 配置)

3. Tab/Space 需要谨慎混用。Tab 只能出现在每行开头。

4. 为更好地辨识 Tab/Space，编辑器中应该启用显示隐藏字符功能

        # Sublime Text 显示 Tab/Space
        "draw_white_space": "all"

5. 代码如果已经用不上，或者有新的代码替代，需要直接删除，而非简单注释(任何代码都可以从版本库找回)。

## HTML

0. 谨慎添加 __ID__，仅对层添加 ID，层内的元素通过 class 或其他方式 定位，禁止再添加过多 ID

1. 由于上条的需求， class 的命名需要添加前缀，避免与重构重复，前缀可以是 __js__ 之类。

        js-close # 需要添加自定义样式 close 来定位
        js-xx-yy # 需要添加自定义样式 xx-yy 来定位

## 编辑器应该启用 EditorConfig 

0. 作用: __确保代码缩进方式与文件编码等与项目保持一致__

1. EditorConfig 支持各种主流编辑器/IDE，详情参考 [http://editorconfig.org/#download](http://editorconfig.org/#download)

2. 一个项目的 `.editorconfig` 应该放置在项目的根目录

## 使用 Git Hooks 自动检查 PHP 语法

* [https://github.com/ReekenX/phpcheck-git](https://github.com/ReekenX/phpcheck-git) 这个 pre-commit 可以在提交前自动运行 `php -l path/to/file.php`，一旦遇到语法错误就会拒绝提交

    1. cd 到项目根目录
    2. `wget 'https://raw.githubusercontent.com/ReekenX/phpcheck-git/master/pre-commit' -O .git/hooks/pre-commit && chmod a+x .git/hooks/pre-commit`

* [PSR 2 Coding Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
* [PSR 1 Coding Standards](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md)
* [PSR 0 Coding Standards](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md)

## JavaScript 代码需要通过 `JSHint` 检查

0. 作用: __避免一些常见错误__

1. [http://www.jshint.com/](http://www.jshint.com/)

2. 代码需要提交合并前运行 `grunt` 或者 `gulp` 即可检查


## 通过 ST3 Plugin 自动格式化代码

### JavaScript 用 [JsFormat](https://packagecontrol.io/packages/JsFormat)
参考设置如下:

        {
            // exposed jsbeautifier options
            // Beautifier Options:
            // -s, --indent-size             Indentation size [4]
            // -c, --indent-char             Indentation character [" "]
            // -l, --indent-level            Initial indentation level [0]
            // -t, --indent-with-tabs        Indent with tabs, overrides -s and -c
            // -p, --preserve-newlines       Preserve line-breaks (--no-preserve-newlines disables)
            // -m, --max-preserve-newlines   Number of line-breaks to be preserved in one chunk [10]
            // -P, --space-in-paren          Add padding spaces within paren, ie. f( a, b )
            // -j, --jslint-happy            Enable jslint-stricter mode
            // -b, --brace-style             [collapse|expand|end-expand] ["collapse"]
            // -B, --break-chained-methods   Break chained method calls across subsequent lines
            // -k, --keep-array-indentation  Preserve array indentation
            // -x, --unescape-strings        Decode printable characters encoded in xNN notation
            // -w, --wrap-line-length        Wrap lines at next opportunity after N characters [0]
            // -X, --e4x                     Pass E4X xml literals through untouched
            // --good-stuff                  Warm the cockles of Crockford's heart
            "indent_size": 4,
            "indent_char": " ",
            "indent_level": 0,
            "indent_with_tabs": false,
            "preserve_newlines": true,
            "max_preserve_newlines": 4,
            "space_in_paren": false,
            "jslint_happy": true,
            "brace_style": "collapse",
            "keep_array_indentation": true,
            "keep_function_indentation": true,
            "space_before_conditional": true,
            "eval_code": false,
            "unescape_strings": false,
            "break_chained_methods": false,
            "e4x": false,
            "wrap_line_length": 140,
        
            // jsformat options
            "format_on_save": true,
            "jsbeautifyrc_files": true
        }

配置完成后，每次保存 JavaScript 文件的时候会自动格式化

### PHP 用 [phpfmt](https://packagecontrol.io/packages/phpfmt)
参考设置如下:

	{
		"disable_auto_align": false,
		"enable_auto_align": true,
		"format_on_save": true,
		"indent_with_space": true,
		"passes":
		[
			"AlignDoubleSlashComments",
			"PrettyPrintDocBlocks",
			"ShortArray",
			"ReindentObjOps",
			"ReindentSwitchBlocks"
		],
		"psr1": true,
		"psr1_naming": false,
		"psr2": true,
		"smart_linebreak_after_curly": false,
		"version": 4,
		"yoda": false
	}

### 文件编码 换行格式通过 [EditorConfig](https://packagecontrol.io/packages/EditorConfig) 自动控制，举例如下：

        # editorconfig.org
        root = true

        [*]
        indent_style = space
        end_of_line = lf
        charset = utf-8
        trim_trailing_whitespace = true
        insert_final_newline = true
        indent_size = 4

        [*.md]
        trim_trailing_whitespace = false

        [*.coffee]
        indent_size = 2

        [Cakefile]
        indent_size = 2
