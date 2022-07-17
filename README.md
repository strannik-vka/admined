## Установка
Мы можем установить Admined из NPM
<pre>npm install admined</pre>

## HTML-макет
Теперь нам нужно создать страницу с базовым html-макетем
<pre>
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;ru&quot;&gt;

&lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot;&gt;
    &lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;meta name=&quot;csrf-token&quot; content=&quot;значение csrf_token&quot;&gt;
    &lt;title&gt;Admined&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;
    &lt;div id=&quot;admined&quot;&gt;&lt;/div&gt;
    &lt;script src=&quot;/js/admin.js&quot;&gt;&lt;/script&gt;
&lt;/body&gt;

&lt;/html&gt;
</pre>

## admin.js
Наконец, нам нужно создать js файл для запуска Admined
<pre>
// Импортируем admined
require('admined');

// Создаем страницу Новости
Admined.page('post', 'Новости', {
    form: [
        {
            name: 'id',
            placeholder: 'ID',
            center: true,
            readonly: true
        },
        {
            name: 'category_id',
            placeholder: 'Категория',
            type: 'select'
        },
        {
            name: 'name',
            placeholder: 'Название'
        },
        {
            name: 'image',
            placeholder: 'Обложка',
            type: 'file'
        },
        {
            name: 'text',
            placeholder: 'Текст',
            type: 'text'
        },
        {
            name: 'published',
            placeholder: 'Опубликован',
            type: 'switch'
        },
        {
            name: 'created_at',
            placeholder: 'Дата публикации',
            description: 'Формат 2022-03-14 16:59',
            type: 'datetime'
        }
    ]
});

// По аналогии дальше создаем нужные страницы
Admined.page('user', 'Пользователи', {...});
</pre>

## Что дальше?
Как видите, очень легко интегрировать Admined в сайт. Итак, вот ваши следующие шаги:
* Перейдите на страницу <a href="https://github.com/strannik-vka/admined/wiki/2-Параметры-страницы">параметры</a>, чтобы узнать больше обо всех возможностях и о том, как им управлять
* Если у вас есть вопросы о Admined, задайте их мне ВКонтакте <a target="_blank" href="https://vk.com/strannik_vka">https://vk.com/strannik_vka</a>
