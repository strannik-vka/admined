import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import File from "./file";
import Input from "./input";
import TextEditor from "./texteditor";
import CustomField from "./customField";
import Poll from "./poll";

class Constructor extends React.Component {

    constructor(props) {
        super(props);

        this.fieldsToCreate = [
            // {
            //     type: 'string',
            //     placeholder: 'Строка',
            //     description: 'Однострочное текстовое поле',
            //     svg: '<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="45" height="45" rx="7.5" stroke="#8B8B8B" stroke-linejoin="round"/><path d="M37.5 32.0101V27.7919M28.5364 20.9374L28.589 20.832C28.9019 20.2062 29.3349 19.6409 29.9161 19.2514C30.1559 19.0907 30.4142 18.9338 30.6454 18.8283C31.4178 18.4758 31.91 18.3883 32.7545 18.301C33.0531 18.2701 33.4349 18.2692 33.7486 18.2765C34.1392 18.2855 34.524 18.3635 34.8947 18.4871L35.0797 18.5488C35.6311 18.7326 36.1321 19.0422 36.5431 19.4532L36.6331 19.5432C36.858 19.7681 37.0453 20.0279 37.1875 20.3124V20.3124C37.393 20.7234 37.5 21.1766 37.5 21.6361V23.0464M37.5 27.7919C37.5 27.7919 36.6462 29.173 35.9182 29.901C35.4673 30.3519 34.7659 30.851 34.2973 31.1657C33.976 31.3814 33.6236 31.5446 33.2565 31.667L32.9776 31.76C32.4806 31.9256 31.9602 32.0101 31.4364 32.0101H31.3247C30.8748 32.0101 30.4279 31.9375 30.001 31.7953L29.771 31.7186C29.3058 31.5635 28.8831 31.3023 28.5364 30.9555L28.4979 30.9171C28.1764 30.5956 27.9342 30.2037 27.7905 29.7725V29.7725C27.5901 29.1714 27.5901 28.5215 27.7905 27.9204V27.9204C27.9342 27.4892 28.1764 27.0973 28.4979 26.7758L28.5364 26.7373C28.8831 26.3906 29.3058 26.1293 29.771 25.9743L30.6454 25.6828L32.7545 25.1555L34.8636 24.6283L35.3257 24.4742C36.0621 24.2288 36.7312 23.8152 37.2801 23.2664L37.5 23.0464M37.5 27.7919V23.0464" stroke="#8B8B8B" stroke-linecap="round"/><path d="M8.5 31.9818L11.1657 25.1273M24.8455 31.9818L22.1798 25.1273M22.1798 25.1273L17.7116 13.6376C17.5621 13.2532 17.192 13 16.7796 13H16.5659C16.1535 13 15.7834 13.2532 15.6339 13.6376L11.1657 25.1273M22.1798 25.1273H11.1657" stroke="#8B8B8B" stroke-linecap="round"/></svg>'
            // },
            {
                type: 'texteditor',
                placeholder: 'Текст',
                description: 'Многострочное текстовое поле',
                svg: '<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="45" height="45" rx="7.5" stroke="#8B8B8B" stroke-linejoin="round"/><path d="M32.5 37.5V34.7571M26.6272 30.3V30.3C26.855 29.8479 27.1683 29.4378 27.5934 29.1629C27.7323 29.0731 27.8774 28.9882 28.0091 28.9285C28.5151 28.6994 28.8376 28.6425 29.3909 28.5857C29.5868 28.5656 29.8376 28.565 30.0433 28.5698C30.2985 28.5757 30.5499 28.6262 30.7922 28.7064L30.9172 28.7478C31.2766 28.8667 31.6034 29.0673 31.8721 29.334L31.9331 29.3945C32.0797 29.54 32.2019 29.7083 32.2949 29.8929V29.8929C32.4297 30.1605 32.5 30.4561 32.5 30.7558V31.6714M32.5 34.7571C32.5 34.7571 31.9406 35.6552 31.4636 36.1286C31.1878 36.4023 30.7689 36.7034 30.4647 36.9087C30.2131 37.0784 29.9363 37.2053 29.6481 37.3006L29.5374 37.3372C29.2115 37.445 28.8705 37.5 28.5272 37.5H28.4528C28.1589 37.5 27.8669 37.4529 27.5878 37.3606L27.4332 37.3095C27.1303 37.2093 26.8548 37.0402 26.6284 36.8154L26.6003 36.7875C26.3909 36.5797 26.2329 36.3258 26.1389 36.046V36.046C26.0075 35.6546 26.0075 35.231 26.1389 34.8397V34.8397C26.2329 34.5599 26.3909 34.306 26.6003 34.0982L26.6284 34.0703C26.8548 33.8455 27.1303 33.6764 27.4332 33.5762L28.0091 33.3857L29.3909 33.0428L30.7727 32.7L30.8849 32.6629C31.4927 32.4618 32.0456 32.1224 32.5 31.6714V31.6714M32.5 34.7571V31.6714" stroke="#8B8B8B" stroke-linecap="round"/><path d="M13.5 37.4816L15.2465 33.0245M24.2091 37.4816L22.4626 33.0245M22.4626 33.0245L19.5618 25.6212C19.4477 25.3302 19.1671 25.1387 18.8545 25.1387V25.1387C18.542 25.1387 18.2613 25.3302 18.1473 25.6212L15.2465 33.0245M22.4626 33.0245H15.2465" stroke="#8B8B8B" stroke-linecap="round"/><path d="M32.5 20.8613V18.1184M26.6272 13.6613V13.6613C26.855 13.2092 27.1683 12.7991 27.5934 12.5241C27.7323 12.4343 27.8774 12.3495 28.0091 12.2898C28.5151 12.0606 28.8376 12.0038 29.3909 11.947C29.5868 11.9268 29.8376 11.9263 30.0433 11.9311C30.2985 11.937 30.5499 11.9875 30.7922 12.0677L30.9172 12.1091C31.2766 12.2279 31.6034 12.4286 31.8721 12.6952L31.9331 12.7558C32.0797 12.9013 32.2019 13.0696 32.2949 13.2542V13.2542C32.4297 13.5218 32.5 13.8174 32.5 14.1171V15.0327M32.5 18.1184C32.5 18.1184 31.9406 19.0165 31.4636 19.4898C31.1878 19.7636 30.7689 20.0647 30.4647 20.2699C30.2131 20.4397 29.9363 20.5666 29.6481 20.6619L29.5374 20.6985C29.2115 20.8063 28.8705 20.8613 28.5272 20.8613H28.4528C28.1589 20.8613 27.8669 20.8142 27.5878 20.7219L27.4332 20.6708C27.1303 20.5706 26.8548 20.4015 26.6284 20.1767L26.6003 20.1488C26.3909 19.9409 26.2329 19.687 26.1389 19.4073V19.4073C26.0075 19.0159 26.0075 18.5923 26.1389 18.2009V18.2009C26.2329 17.9212 26.3909 17.6673 26.6003 17.4594L26.6284 17.4315C26.8548 17.2068 27.1303 17.0377 27.4332 16.9375L28.0091 16.747L29.3909 16.4041L30.7727 16.0613L30.8849 16.0241C31.4927 15.8231 32.0456 15.4837 32.5 15.0327V15.0327M32.5 18.1184V15.0327" stroke="#8B8B8B" stroke-linecap="round"/><path d="M13.5 20.8429L15.2465 16.3857M24.2091 20.8429L22.4626 16.3857M22.4626 16.3857L19.5618 8.98247C19.4477 8.69146 19.1671 8.5 18.8545 8.5V8.5C18.542 8.5 18.2613 8.69146 18.1473 8.98247L15.2465 16.3857M22.4626 16.3857H15.2465" stroke="#8B8B8B" stroke-linecap="round"/></svg>'
            },
            {
                type: 'image',
                placeholder: 'Картинка',
                description: 'Загрузка изображения',
                svg: '<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.30769 0.5H40.6923C43.2725 0.5 45.5 3.00299 45.5 6.27273V39.7273C45.5 42.997 43.2725 45.5 40.6923 45.5H5.30769C2.72752 45.5 0.5 42.997 0.5 39.7273V6.27273C0.5 3.00299 2.72752 0.5 5.30769 0.5Z" stroke="#8B8B8B" stroke-linejoin="round"/><path d="M37.5 11.5385C37.5 13.2217 36.1517 14.5769 34.5 14.5769C32.8483 14.5769 31.5 13.2217 31.5 11.5385C31.5 9.8552 32.8483 8.5 34.5 8.5C36.1517 8.5 37.5 9.8552 37.5 11.5385Z" stroke="#8B8B8B" stroke-miterlimit="10"/><path d="M29 28.5L18.5953 18.2784C17.9574 17.6406 17.1 17.2705 16.1983 17.2438C15.2967 17.2171 14.4188 17.5357 13.7443 18.1346L0.5 30M9 45.5L33.4126 25.2845C34.0363 24.6595 34.8712 24.2903 35.7532 24.2494C36.6352 24.2085 37.5007 24.4988 38.1796 25.0634L45.5 31.5" stroke="#8B8B8B" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            },
            // {
            //     type: 'gallery',
            //     placeholder: 'Галерея',
            //     description: 'Несколько изображений',
            //     svg: '<svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-inside-1_5_47" fill="white"><path d="M39 8V5.31818C38.9965 3.90897 38.5213 2.55865 37.6782 1.56218C36.835 0.565714 35.6924 0.00409232 34.5 0H4.5C3.30759 0.00409232 2.16501 0.565714 1.32184 1.56218C0.47868 2.55865 0.00346273 3.90897 0 5.31818V33.6818C0.00346273 35.091 0.47868 36.4414 1.32184 37.4378C2.16501 38.4343 3.30759 38.9959 4.5 39H8"/></mask><path d="M39 5.31818H40L40 5.31572L39 5.31818ZM34.5 0L34.5034 -1H34.5V0ZM4.5 0V-1.00001L4.49657 -0.999994L4.5 0ZM0 5.31818L-1 5.31572V5.31818H0ZM0 33.6818H-1L-0.999997 33.6843L0 33.6818ZM4.5 39L4.49657 40H4.5V39ZM40 8V5.31818H38V8H40ZM40 5.31572C39.996 3.69104 39.4495 2.10746 38.4415 0.916238L36.9148 2.20812C37.5931 3.00984 37.9971 4.1269 38 5.32064L40 5.31572ZM38.4415 0.916238C37.4294 -0.279941 36.0187 -0.994794 34.5034 -0.999994L34.4966 0.999994C35.3661 1.00298 36.2406 1.41137 36.9148 2.20812L38.4415 0.916238ZM34.5 -1H4.5V1H34.5V-1ZM4.49657 -0.999994C2.98126 -0.994794 1.57061 -0.279941 0.558458 0.916238L2.08523 2.20812C2.75941 1.41137 3.63392 1.00298 4.50343 0.999994L4.49657 -0.999994ZM0.558458 0.916238C-0.449497 2.10746 -0.996005 3.69104 -0.999997 5.31572L0.999997 5.32064C1.00293 4.1269 1.40686 3.00984 2.08523 2.20812L0.558458 0.916238ZM-1 5.31818V33.6818H1V5.31818H-1ZM-0.999997 33.6843C-0.996005 35.309 -0.449497 36.8925 0.558458 38.0838L2.08523 36.7919C1.40686 35.9902 1.00293 34.8731 0.999997 33.6794L-0.999997 33.6843ZM0.558458 38.0838C1.57061 39.2799 2.98126 39.9948 4.49657 40L4.50343 38C3.63392 37.997 2.75941 37.5886 2.08523 36.7919L0.558458 38.0838ZM4.5 40H8V38H4.5V40Z" fill="#8B8B8B" mask="url(#path-1-inside-1_5_47)"/><path d="M12.5 8.5H42.5C44.6341 8.5 46.5 10.5756 46.5 13.3182V41.6818C46.5 44.4244 44.6341 46.5 42.5 46.5H12.5C10.3659 46.5 8.5 44.4244 8.5 41.6818V13.3182C8.5 10.5756 10.3659 8.5 12.5 8.5Z" stroke="#8B8B8B" stroke-linejoin="round"/><path d="M38.5 19C38.5 20.3807 37.3807 21.5 36 21.5C34.6193 21.5 33.5 20.3807 33.5 19C33.5 17.6193 34.6193 16.5 36 16.5C37.3807 16.5 38.5 17.6193 38.5 19Z" stroke="#8B8B8B" stroke-miterlimit="10"/><path d="M32.7 32.5615L23.6826 23.88C23.1297 23.3383 22.3866 23.024 21.6052 23.0013C20.8238 22.9786 20.063 23.2493 19.4784 23.7579L8.5 33.5M16 46.5L36.5242 29.8305C37.0648 29.2997 37.7883 28.9861 38.5528 28.9514C39.3172 28.9166 40.0672 29.1632 40.6556 29.6427L46.5 35" stroke="#8B8B8B" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            // },
            {
                type: 'video',
                placeholder: 'Видео',
                description: 'Ссылка YouTube или iframe код',
                svg: '<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.30769 0.5H40.6923C43.2725 0.5 45.5 3.00299 45.5 6.27273V39.7273C45.5 42.997 43.2725 45.5 40.6923 45.5H5.30769C2.72752 45.5 0.5 42.997 0.5 39.7273V6.27273C0.5 3.00299 2.72752 0.5 5.30769 0.5Z" stroke="#8B8B8B" stroke-linejoin="round"/><path d="M30.9244 26.2876L36.0937 29.9141C36.246 29.9815 36.4128 30.01 36.5789 29.9969C36.745 29.9838 36.9051 29.9296 37.0449 29.8391C37.1846 29.7486 37.2994 29.6248 37.3789 29.4788C37.4584 29.3329 37.5 29.1694 37.5 29.0034V16.9966C37.5 16.8306 37.4584 16.6671 37.3789 16.5212C37.2994 16.3752 37.1846 16.2514 37.0449 16.1609C36.9051 16.0704 36.745 16.0162 36.5789 16.0031C36.4128 15.99 36.246 16.0185 36.0937 16.0859L30.9244 19.7124C30.7933 19.8044 30.6863 19.9264 30.6125 20.0682C30.5386 20.21 30.5 20.3674 30.5 20.5271V25.4729C30.5 25.6326 30.5386 25.79 30.6125 25.9318C30.6863 26.0736 30.7933 26.1956 30.9244 26.2876Z" stroke="#8B8B8B" stroke-linecap="round" stroke-linejoin="round"/><path d="M24.0694 31H11.9306C11.0215 30.9975 10.1505 30.6543 9.50767 30.0454C8.86488 29.4364 8.50261 28.6112 8.5 27.75V18.25C8.50261 17.3888 8.86488 16.5636 9.50767 15.9546C10.1505 15.3457 11.0215 15.0025 11.9306 15H24.1011C25.0017 15.0026 25.8646 15.3427 26.5014 15.946C27.1382 16.5493 27.4972 17.3668 27.5 18.22V27.75C27.4974 28.6112 27.1351 29.4364 26.4923 30.0454C25.8495 30.6543 24.9785 30.9975 24.0694 31Z" stroke="#8B8B8B" stroke-miterlimit="10"/></svg>'
            },
            {
                type: 'audio',
                placeholder: 'Аудио',
                description: 'Загрузка аудиозаписи',
                svg: '<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.30769 0.5H40.6923C43.2725 0.5 45.5 3.00299 45.5 6.27273V39.7273C45.5 42.997 43.2725 45.5 40.6923 45.5H5.30769C2.72752 45.5 0.5 42.997 0.5 39.7273V6.27273C0.5 3.00299 2.72752 0.5 5.30769 0.5Z" stroke="#8B8B8B" stroke-linejoin="round"/><path d="M16.2414 20.4138V19.9702C16.2414 18.873 16.9803 17.9739 18.0325 17.7085L30.9333 14.2572C31.1519 14.1986 31.3811 14.1911 31.603 14.2352C31.825 14.2793 32.0339 14.3738 32.2137 14.5115C32.3934 14.6492 32.5391 14.8263 32.6395 15.0292C32.74 15.2321 32.7925 15.4555 32.7931 15.6819V17.3085" stroke="#8B8B8B" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.7931 25.876V31.6449C32.7931 32.6479 32.1291 33.4902 31.1573 33.8082L29.5216 34.3851C27.5958 35.0139 25.6552 33.6337 25.6552 31.6449C25.6507 31.134 25.8141 30.635 26.1215 30.2201C26.429 29.8052 26.8646 29.4961 27.3653 29.3373L31.1573 28.0285C32.1291 27.7112 32.7931 26.879 32.7931 25.876ZM32.7931 25.876V8.71779C32.7926 8.60739 32.7659 8.49858 32.7152 8.39974C32.6645 8.30091 32.591 8.21469 32.5005 8.14774C32.41 8.08078 32.3048 8.03488 32.1931 8.01357C32.0814 7.99225 31.9662 7.9961 31.8563 8.0248L17.0302 11.8907C16.7716 11.9615 16.5442 12.1128 16.383 12.3213C16.2217 12.5298 16.1356 12.7839 16.1379 13.0445V29.3416M16.1379 29.3416C16.1379 30.3447 15.474 31.1877 14.5022 31.505L10.6358 32.803C9.60375 33.1405 9 34.0447 9 35.1105C9 37.0994 10.9719 38.4673 12.8664 37.8508L14.5022 37.2739C15.474 36.9566 16.1379 36.1143 16.1379 35.1105V29.3416Z" stroke="#8B8B8B" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            },
            {
                type: 'file',
                placeholder: 'Файл',
                description: 'Загрузка любого файла',
                svg: '<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.30769 0.5H40.6923C43.2725 0.5 45.5 3.00299 45.5 6.27273V39.7273C45.5 42.997 43.2725 45.5 40.6923 45.5H5.30769C2.72752 45.5 0.5 42.997 0.5 39.7273V6.27273C0.5 3.00299 2.72752 0.5 5.30769 0.5Z" stroke="#8B8B8B" stroke-linejoin="round"/><path d="M11.7569 19.4508V27.5906C11.7667 28.1871 12.0183 28.7559 12.4575 29.1744C12.8967 29.5928 13.4883 29.8274 14.1046 29.8274C14.7209 29.8274 15.3125 29.5928 15.7518 29.1744C16.191 28.7559 16.4426 28.1871 16.4524 27.5906L16.46 16.8992C16.4664 16.3894 16.3681 15.8834 16.171 15.4106C15.9739 14.9378 15.6817 14.5076 15.3115 14.1449C14.9413 13.7822 14.5004 13.4943 14.0144 13.2977C13.5284 13.1012 13.0069 13 12.4801 13C11.9534 13 11.4319 13.1012 10.9459 13.2977C10.4598 13.4943 10.0189 13.7822 9.64873 14.1449C9.27854 14.5076 8.9864 14.9378 8.78926 15.4106C8.59212 15.8834 8.4939 16.3894 8.50029 16.8992V27.6626C8.52156 29.0852 9.12036 30.4426 10.1673 31.4414C11.2141 32.4401 12.625 33 14.095 33C15.5649 33 16.9758 32.4401 18.0227 31.4414C19.0696 30.4426 19.6684 29.0852 19.6897 27.6626V17.6046" stroke="#8B8B8B" stroke-miterlimit="10" stroke-linecap="square"/><line x1="23.7586" y1="17.5" x2="38" y2="17.5" stroke="#8B8B8B"/><line x1="23.7586" y1="21.5" x2="30.8793" y2="21.5" stroke="#8B8B8B"/><line x1="23.7586" y1="25.5" x2="38" y2="25.5" stroke="#8B8B8B"/></svg>'
            },
            {
                type: 'poll',
                placeholder: 'Опрос',
                description: 'Создать опрос',
                svg: '<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.30769 0.5H40.6923C43.2725 0.5 45.5 3.00299 45.5 6.27273V39.7273C45.5 42.997 43.2725 45.5 40.6923 45.5H5.30769C2.72752 45.5 0.5 42.997 0.5 39.7273V6.27273C0.5 3.00299 2.72752 0.5 5.30769 0.5Z" stroke="#8B8B8B" stroke-linejoin="round"/><path d="M19.3182 14.871C19.3182 17.8342 16.8995 20.2419 13.9091 20.2419C10.9187 20.2419 8.5 17.8342 8.5 14.871C8.5 11.9077 10.9187 9.5 13.9091 9.5C16.8995 9.5 19.3182 11.9077 19.3182 14.871Z" stroke="#8B8B8B"/><path d="M19.3182 31.129C19.3182 34.0923 16.8995 36.5 13.9091 36.5C10.9187 36.5 8.5 34.0923 8.5 31.129C8.5 28.1658 10.9187 25.7581 13.9091 25.7581C16.8995 25.7581 19.3182 28.1658 19.3182 31.129Z" stroke="#8B8B8B"/><path d="M10.3077 15.4886L12.6154 17.2082L17.4615 13.3105" stroke="#8B8B8B"/><line x1="23.4546" y1="13.0162" x2="38" y2="13.0162" stroke="#8B8B8B"/><line x1="23.4546" y1="16.629" x2="38" y2="16.629" stroke="#8B8B8B"/><line x1="23.4546" y1="29.2742" x2="38" y2="29.2742" stroke="#8B8B8B"/><line x1="23.4546" y1="32.8871" x2="38" y2="32.8871" stroke="#8B8B8B"/></svg>'
            }
        ];

        let fieldsFromUser = Array.isArray(this.props.fields) ? this.props.fields : [];

        fieldsFromUser = fieldsFromUser.map(item => {
            return {
                type: item.name,
                placeholder: item.placeholder,
                description: item.description,
                src: item.src,
                svg: item.svg,
            };
        });

        let fields = this.getFieldsDB(),
            fieldsToCreate = [...this.fieldsToCreateAllow(), ...fieldsFromUser];

        if (fields.length == 0 && fieldsToCreate.length) {
            let idGenerate = this.generateId();

            fields.push({
                name: this.props.name + '[' + fieldsToCreate[0].type + '_' + idGenerate + ']',
                id: idGenerate,
                type: fieldsToCreate[0].type,
                value: ''
            });
        }

        this.state = {
            fields: fields,
            fieldsToCreate: fieldsToCreate,
            screen: null
        }
    }

    fieldsToCreateAllow() {
        if (Array.isArray(this.props.defaultFields)) {
            let result = [];

            this.props.defaultFields.forEach(type => {
                for (let i = 0; i < this.fieldsToCreate.length; i++) {
                    let field = this.fieldsToCreate[i];

                    if (field.type == type) {
                        result.push(field);
                    }
                }
            });

            if (result.length) {
                this.fieldsToCreate = result;
            }
        }

        return this.fieldsToCreate;
    }

    getFieldsDB() {
        let fields = [];

        if (Array.isArray(this.props.value)) {
            this.props.value.forEach(item => {
                let name = Object.keys(item)[0],
                    nameArr = name.split('_');

                fields.push({
                    name: this.props.name + '[' + name + ']',
                    id: nameArr[1],
                    type: nameArr[0],
                    value: item[name]
                });
            });
        } else if (typeof this.props.value === 'string') {
            let idGenerate = this.generateId();

            fields.push({
                name: this.props.name + '[texteditor_' + idGenerate + ']',
                id: idGenerate,
                type: 'texteditor',
                value: this.props.value
            });
        }

        return fields;
    }

    generateId() {
        return new String(Math.random()).replace('.', '');
    }

    addField = (type, id) => {
        document.body.click();

        var idGenerate = this.generateId(),
            name = this.props.name + '[' + type + '_' + idGenerate + ']';

        this.setState(prevState => {
            let item = {
                name: name,
                type: type,
                id: idGenerate
            };

            if (id !== null) {
                let indexPaste = null;

                prevState.fields.forEach((element, index) => {
                    if (element.id === id) {
                        indexPaste = index;
                    }
                });

                prevState.fields.splice(indexPaste, 0, item);
            } else {
                prevState.fields.push(item);
            }

            return {
                fields: prevState.fields
            };
        }, () => {
            let input = document.querySelector('[name="' + name + '"]');

            if (input) {
                if (input.getAttribute('type') == 'file') {
                    input.click();
                } else {
                    input.focus();
                }
            }
        });
    }

    delField = (id) => {
        let inputs = document.querySelectorAll('[name*="' + id + '"]'),
            isValue = null;

        if (inputs.length) {
            inputs.forEach(input => {
                if (input.value) {
                    isValue = true;
                }
            });
        }

        if (isValue) {
            if (!confirm('Подтверждаете удаление?')) {
                return false;
            }
        }

        this.setState(prevState => {
            prevState.fields = prevState.fields.filter((field) => id !== field.id);

            return {
                fields: prevState.fields
            };
        });
    }

    dragField = (id, up) => {
        this.setState((prevState) => {
            let indexPaste = null,
                fieldPaste = null;

            prevState.fields.forEach((field, index) => {
                if (field.id === id) {
                    indexPaste = index;
                    fieldPaste = field;
                }
            });

            prevState.fields.splice(up ? indexPaste - 1 : indexPaste + 2, 0, fieldPaste);
            prevState.fields.splice(up ? indexPaste + 1 : indexPaste, 1);

            return {
                fields: prevState.fields
            };
        });
    }

    onMouseEnter = (field) => {
        this.setState({
            screen: this.props.screen && this.props.screen[field.type]
                ? this.props.screen[field.type] : null
        });
    }

    onMouseLeave = () => {
        this.setState({
            screen: null
        });
    }

    getActions(id, index) {
        let buttons = [],
            isEnd = index === undefined,
            isPenult = (this.state.fields.length - 1) === index,
            isFirst = index === 0;

        if (isEnd) {
            buttons.push(<div key={'btn_' + id + '_' + index + '_empty'} className="desc">Жми на плюсик, чтобы добавить контент</div>);
        } else {
            buttons.push(<div key={'btn_' + id + '_' + index + '_add'} className="multiple_block_icon" onClick={() => this.delField(id)}><svg className="delete" viewBox="0 0 14 14"><path d="M13.5000308,3.23952 C13.5000308,4.55848168 11.9230308,12.0493 11.9230308,12.0782 C11.9230308,12.6571 9.73825083,14 7.04165083,14 C4.34504083,14 2.16025083,12.6571 2.16025083,12.0782 C2.16025083,12.0541 0.5,4.55799105 0.5,3.23952 C0.5,1.91780104 3.02713083,0 7.03525083,0 C11.0433308,0 13.5000308,1.9178004 13.5000308,3.23952 Z M7,2 C3.625,2 2.5,3.25 2.5,4 C2.5,4.75 3.625,6 7,6 C10.375,6 11.5,4.75 11.5,4 C11.5,3.25 10.375,2 7,2 Z"></path></svg></div>);

            if (!isFirst) {
                buttons.push(<div key={'btn_' + id + '_' + index + '_up'} className="multiple_block_icon" onClick={() => this.dragField(id, true)}><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8.53033 1.36967C8.23744 1.07678 7.76256 1.07678 7.46967 1.36967L2.6967 6.14264C2.40381 6.43554 2.40381 6.91041 2.6967 7.2033C2.98959 7.4962 3.46447 7.4962 3.75736 7.2033L8 2.96066L12.2426 7.2033C12.5355 7.4962 13.0104 7.4962 13.3033 7.2033C13.5962 6.91041 13.5962 6.43554 13.3033 6.14264L8.53033 1.36967ZM8.75 14.9V1.9H7.25L7.25 14.9H8.75Z" /></svg></div>);
            }

            if (!isPenult) {
                buttons.push(<div key={'btn_' + id + '_' + index + 'down'} className="multiple_block_icon" onClick={() => this.dragField(id)}><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.46967 14.6303C7.76256 14.9232 8.23744 14.9232 8.53033 14.6303L13.3033 9.85736C13.5962 9.56447 13.5962 9.08959 13.3033 8.7967C13.0104 8.5038 12.5355 8.5038 12.2426 8.7967L8 13.0393L3.75736 8.7967C3.46447 8.5038 2.98959 8.5038 2.6967 8.7967C2.40381 9.08959 2.40381 9.56446 2.6967 9.85736L7.46967 14.6303ZM7.25 1.1L7.25 14.1L8.75 14.1L8.75 1.1L7.25 1.1Z" /></svg></div>);
            }
        }

        let plusBtn = this.fieldsToCreate.length == 1
            ? <div onClick={() => this.addField(this.fieldsToCreate[0].type, id)} className="multiple_block_icon"><svg viewBox="0 0 16 16"><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path></svg></div>
            : <OverlayTrigger
                trigger="click"
                key="right"
                placement="right"
                rootClose={true}
                overlay={
                    <Popover>
                        <Popover.Header as="h3">
                            Выберите поле
                            {
                                this.state.screen ? <div className="constructor-screen">
                                    <img src={this.state.screen} />
                                </div> : ''
                            }
                        </Popover.Header>
                        <Popover.Body>
                            {
                                this.state.fieldsToCreate.map((field, index) => {
                                    let screen = this.props.screen && this.props.screen[field.type]
                                        ? this.props.screen[field.type] : null,
                                        img = '';

                                    if (field.svg) {
                                        img = field.svg;
                                    } else if (field.src) {
                                        img = '<img src="' + field.src + '" />';
                                    } else if (screen) {
                                        img = '<img src="' + screen + '" />';
                                    }

                                    return <div key={'field_' + id + '_' + index} className="constructor-field"
                                        onClick={() => this.addField(field.type, id)}
                                        onMouseEnter={() => this.onMouseEnter(field)}
                                        onMouseLeave={() => this.onMouseLeave()}
                                    >
                                        <div className="left" dangerouslySetInnerHTML={{ __html: img }}></div>
                                        <div className="right">
                                            <div className="name">{field.placeholder}</div>
                                            <div className="description">{field.description}</div>
                                        </div>
                                    </div>
                                })
                            }
                        </Popover.Body>
                    </Popover>
                }
            ><div className="multiple_block_icon"><svg viewBox="0 0 16 16"><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path></svg></div></OverlayTrigger>;

        return <div className={'constructor-actions ' + (isEnd ? 'end' : 'mb-2')}>
            {plusBtn}
            {buttons}
        </div>
    }

    getField(field) {
        let result = null;

        if (field.type == 'string') {
            result = <Input name={field.name} value={field.value} />
        } else if (field.type == 'texteditor') {
            result = <TextEditor name={field.name} value={field.value} />
        } else if (field.type == 'image') {
            result = <File name={field.name} value={field.value} />
        } else if (field.type == 'video') {
            result = <Input name={field.name} value={field.value} type="video" />
        } else if (field.type == 'audio') {
            result = <File name={field.name} value={field.value} />
        } else if (field.type == 'file') {
            result = <File name={field.name} value={field.value} />
        } else if (field.type == 'poll') {
            result = <Poll name={field.name} value={field.value} {...(this.props.options && this.props.options.poll ? this.props.options.poll : null)} />
        } else {
            result = <CustomField field={field} fields={this.props.fields} />
        }

        return result;
    }

    getHiddenFields() {
        let result = [];

        this.state.fields.map(field => {
            result.push(field.id);
        });

        return <>
            <input type="hidden" name={this.props.name + '_sort'} value={result.join(',')} />
            {
                this.state.fields.length == 0
                    ? <input type="hidden" name={this.props.name} value="" />
                    : ''
            }
        </>
    }

    render() {
        return <fieldset className="notLegend">
            {
                this.state.fields.map((field, index) => {
                    return <div
                        key={field.id}
                        className="form-group mb-3"
                    >
                        {this.getActions(field.id, index)}
                        {this.getField(field)}
                    </div>
                })
            }
            {
                this.getActions(null)
            }
            {
                this.getHiddenFields()
            }
        </fieldset>
    }

}

export default Constructor;