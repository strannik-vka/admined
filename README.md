# import
import Admined from 'admined';

# create page
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

# form object options
{
    name: 'id', - name
    placeholder: 'ID', - placeholder
    readonly: true, - readonly
    center: true, - text-align: center
    filter: false, - Не выводить в фильтре
    filter: 'readonly', - readonly в фильтре 
}
