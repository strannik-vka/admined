import React, { useEffect, useState } from "react";
import { Swappable, Plugins } from '@shopify/draggable';

export default (props) => {
    const [images, setImages] = useState(
        Array.isArray(props.value)
            ? [...props.value, { type: 'button' }]
            : [{ type: 'button' }]
    );

    const onChange = (e) => {
        let files = [];

        for (let i = 0; i < e.target.files.length; i++) {
            let name = e.target.files[i].name,
                lastDot = name.lastIndexOf('.');

            files.push({
                url: URL.createObjectURL(e.target.files[i]),
                name: name.substring(0, lastDot),
                extension: name.substring(lastDot + 1)
            });
        }

        files.push({ type: 'button' });

        setImages(prevImages => {
            prevImages.splice(prevImages.length - 1, 1);

            return [...prevImages, ...files];
        });

        setTimeout(() => {
            e.target.value = '';
        }, 400);
    }

    const deleteImage = (image_url) => {
        setImages(prevImages => {
            let newImages = prevImages.filter(image => image.url !== image_url);

            if (newImages.length == 1) {
                props.onDelete();
            }

            return newImages;
        });
    }

    const addImages = () => {
        document.querySelector('[data-name="' + props.name + '"]').click();
    }

    let imagesChanks = [];
    for (let i = 0; i < images.length; i += 5) {
        imagesChanks.push(images.slice(i, i + 5));
    }

    useEffect(() => {
        const draggable = new Swappable(document.querySelectorAll('.gallery .grid'), {
            draggable: '.draggable',
            mirror: {
                appendTo: '.gallery .grid',
                constrainDimensions: true,
            },
            plugins: [Plugins.ResizeMirror],
        });

        draggable.on('drag:stop', (e) => {
            setTimeout(() => {
                setImages(prevImages => {
                    let imageElems = e.sourceContainer.querySelectorAll('.image'),
                        newImages = [];

                    for (let i = 0; i < imageElems.length; i++) {
                        let image = prevImages.filter(prevImage => {
                            return prevImage.url == imageElems[i].getAttribute('src');
                        });

                        if (image.length) {
                            newImages.push(image[0]);
                        }
                    }

                    newImages.push({ type: 'button' });

                    return newImages;
                });
            }, 500);
        });

        document.body.onfocus = () => {
            setTimeout(() => {
                let input = document.querySelector('[data-name="' + props.name + '"]');

                if (input) {
                    if (
                        input.files.length == 0 &&
                        document.querySelectorAll('#' + props.name + ' .image').length == 0
                    ) {
                        props.onDelete();
                    }
                }
            }, 300);
        }
    }, []);

    return <div id={props.name} className="gallery">
        <div className="grid">
            {
                imagesChanks.map((chankImages, chankIndex) => {
                    return <div key={JSON.stringify(chankImages)} className="row">
                        {
                            chankImages.map((image, imageIndex) =>
                                <div key={chankIndex + '_' + imageIndex} className="col-20">
                                    {
                                        image.type == 'button'
                                            ? <div className="imageParent imageAdd" onClick={addImages}>
                                                <div>
                                                    <svg viewBox="0 0 16 16"><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z" fill="currentColor"></path></svg>
                                                    Добавить ещё
                                                </div>
                                            </div>
                                            : <>
                                                <div className="imageDelete" onClick={() => deleteImage(image.url)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#fff"><path d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z"></path></svg>
                                                </div>
                                                <div className="imageParent draggable">
                                                    <img
                                                        src={image.url}
                                                        data-name={image.name}
                                                        data-extension={image.extension}
                                                        className="image" />
                                                </div>
                                            </>
                                    }
                                </div>
                            )
                        }
                    </div>
                })
            }
        </div>

        <input type="file" accept="image/*" data-name={props.name} multiple
            onChange={onChange}
        />
    </div >
}