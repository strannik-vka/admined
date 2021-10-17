# import
<pre>
import Admined from 'admined';
</pre>

# create page
<pre>
Admined.page('news', 'Новости', {
    form: [
        {
            name: 'id',
            placeholder: 'ID',
            readonly: true,
            center: true
        },
        {
            name: 'title',
            placeholder: 'Название'
        },
        {
            name: 'body',
            placeholder: 'Текст',
            type: 'text',
        }
    ]
});
</pre>

# form object options
<pre>
name: 'id' - name
placeholder: 'ID' - placeholder
readonly: true - readonly
center: true - текст по центру
filter: 
    false - Не выводить в фильтре
    'readonly' - readonly в фильтре
type: 
    'text' - Текстовое поле
    'texteditor' - Визуальный редактор
    'file' - Выбор файла
    'switch' - Переключение
    'datetime' - Дата и время
    'select' - Выбор из списка
</pre>
