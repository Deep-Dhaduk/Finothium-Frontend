import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { GridOverlay } from "@mui/x-data-grid";
import cryptoJs from "crypto-js";
import jwt from 'jsonwebtoken'
import { Bounce, toast } from 'react-toastify';
import { fetchAccountData } from "src/api/master/accountMaster";
import { fetchClientData } from "src/api/master/clientMaster";
import { fetchCommonData } from "src/api/master/commonMaster";
import { account_Group, account_Type, adminRoleName, category, client, paymentType, superAdminRoleName, subCategory, tenantExpireWarningDays } from "src/varibles/constant";
import { navAllChildren } from "src/varibles/navigation";
import { defaultRowMessage } from "src/varibles/variable";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY

export const getDecodedToken = () => {
    const token = (localStorage.getItem('accessToken'))
    const decodedToken = jwt.decode(token)
    return decodedToken
}
export const getDecodedTokenValue = () => {
    const decodedToken = getDecodedToken()
    const tenantDays = decodedToken ? decodedToken.tenantDays : null;
    const tenantExpire = decodedToken ? decodedToken.tenantExpire : null;
    const companyId = decodedToken ? decodedToken.companyId : null;
    const expiryDate = decodedToken ? decodedToken.expiryDate : null;
    const companyName = decodedToken ? decodedToken.companyName : null;

    return { tenantDays, tenantExpire, companyId, expiryDate, companyName }
}

export const getNextYearDate = () => {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    return nextYear;
}

export const formatDate = (date) => {
    const currentDate = new Date(date);
    if (isNaN(currentDate.getTime())) {
        return null;
    }

    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const year = currentDate.getFullYear();

    return `${String(day).padStart(2, '0')}-${month}-${year}`;
}

export const formatDateRange = (fromDate, toDate) => {
    const currentDate = new Date(fromDate);
    if (isNaN(currentDate.getTime())) {
        return null;
    }
    const currentToDate = new Date(toDate);
    if (isNaN(currentToDate.getTime())) {
        return null;
    }

    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const year = currentDate.getFullYear();

    const toDay = currentToDate.getDate();
    const toMonth = currentToDate.toLocaleString('default', { month: 'short' });
    const toYear = currentToDate.getFullYear();

    return `${String(day).padStart(2, '0')}-${month}-${year} to  ${String(toDay).padStart(2, '0')}-${toMonth}-${toYear}`;
}

export const formatMonth = (date) => {
    const currentDate = new Date(date);
    if (isNaN(currentDate.getTime())) {
        return null;
    }

    const month = currentDate.toLocaleString('default', { month: 'short' });
    const year = currentDate.getFullYear();

    return `${month}-${year}`;
}
export const formatMonthRange = (startDate, endDate) => {
    const startNewDate = new Date(startDate);
    const endNewDate = new Date(endDate);
    if (isNaN(startNewDate.getTime())) {
        return null;
    }
    if (isNaN(endNewDate.getTime())) {
        return null;
    }

    const startMonth = startNewDate.toLocaleString('default', { month: 'short' });
    const startYear = startNewDate.getFullYear();
    const endMonth = endNewDate.toLocaleString('default', { month: 'short' });
    const endYear = endNewDate.getFullYear();
    return `${startMonth}-${startYear} to ${endMonth}-${endYear}`;
}

export const formatTime = (date, showSeconds) => {
    const currentDate = new Date(date);
    if (isNaN(currentDate.getTime())) {
        return null;
    }

    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    if (showSeconds) {
        return `${String(formattedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    } else {
        return `${String(formattedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
    }
}

export const formatDateTime = (date) => {
    const fDate = formatDate(date);
    const fTime = formatTime(date);

    return `${fDate} ${fTime}`;
}

export const AppTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => (
    {
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'black',
            color: theme.palette.mode === 'dark' ? 'black' : 'white',
            boxShadow: theme.shadows[1],
            fontSize: 13,
        },
    }));

export const addClass = (mode) => {
    const theme = JSON.parse(localStorage.getItem("settings"))
    if (mode || theme.mode === "dark") {
        var element = document.getElementsByTagName("body");
        element[0].classList.remove("light-theme");
        element[0].classList.add("dark-theme");
    } else {
        var element = document.getElementsByTagName("body");
        element[0].classList.remove("dark-theme");
        element[0].classList.add("light-theme");
    }
}

export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    resolve(base64data);
                };
                reader.onerror = (error) => reject(error);
            }, 'image/jpeg');
        };

        image.onerror = (error) => reject(error);
        image.src = imageSrc;
    });
};

export const CustomNoRowsOverlay = () => {
    return (
        <GridOverlay>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div>{defaultRowMessage}</div>
                {/* You can customize the message above */}
            </div>
        </GridOverlay>
    );
};

export const add5_5HoursToDate = (date) => {
    const timeZoneOffSet = new Date().getTimezoneOffset() * 60 * 1000 * -1;
    const adjustedDate = new Date(date.getTime() + timeZoneOffSet);
    return adjustedDate;
}


export const checkGuardAllowAccess = (objectsArray, path) => {
    const navSetting = navAllChildren.find(x => x.path === path)
    const childName = navSetting.title ?? ''

    return checkAllowAccess(objectsArray, childName);
}

export const checkAllowAccess = (objectsArray, childName) => {
    const user = JSON.parse(localStorage.getItem("userData"))
    if (user.roleName.toLowerCase() == adminRoleName || user.roleName.toLowerCase() == superAdminRoleName) {
        return true
    }
    const object = objectsArray.find(obj => obj.child_menu_name === childName);
    return (!!object && object.allow_access === 1);
}

export const checkAllowAdd = (objectsArray, childName) => {
    const user = JSON.parse(localStorage.getItem("userData"))
    if (user.roleName.toLowerCase() == adminRoleName || user.roleName.toLowerCase() == superAdminRoleName) {
        return true
    }
    const object = objectsArray.find(obj => obj.child_menu_name === childName);
    return (!!object && object.allow_add === 1);
}

export const checkAllowEdit = (objectsArray, childName) => {
    const user = JSON.parse(localStorage.getItem("userData"))
    if (user.roleName.toLowerCase() == adminRoleName || user.roleName.toLowerCase() == superAdminRoleName) {
        return true
    }
    const object = objectsArray.find(obj => obj.child_menu_name === childName);
    return (!!object && object.allow_edit === 1);
}

export const checkAllowDelete = (objectsArray, childName) => {
    const user = JSON.parse(localStorage.getItem("userData"))
    if (user.roleName.toLowerCase() == adminRoleName || user.roleName.toLowerCase() == superAdminRoleName) {
        return true
    }
    const object = objectsArray.find(obj => obj.child_menu_name === childName);
    return (!!object && object.allow_delete === 1);
}

export const showSuccessToast = (msg) => {
    toast.success(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: `colored`,
        transition: Bounce,
    });
};

export const showErrorToast = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
};

export const encryptPassword = (password) => {
    return cryptoJs.AES.encrypt(password, secretKey).toString();
};

export const decryptPassword = (encryptedPassword) => {
    const bytes = cryptoJs.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(cryptoJs.enc.Utf8);
};


export const customFooter = () => (
    <div style={{ textAlign: 'center', padding: '10px' }}>
        Your custom message or content goes here
    </div>
);

export const cardTextColor = (amount) => {
    return amount < 0 ? 'error.main' : 'success.dark'
}

export const getAllFilterData = async () => {
    const accountData = await fetchAccountData()
    const paymentTypeData = await fetchCommonData({ type: paymentType })
    const accountTypeData = await fetchCommonData({ type: account_Type })
    const accountGroupData = await fetchCommonData({ type: account_Group })
    const subCategoryData = await fetchCommonData({ type: subCategory })
    const clientData = await fetchClientData({ type: client })
    const categoryData = await fetchClientData({ type: category })
    return { accountData: accountData.data, paymentTypeData: paymentTypeData.data, accountTypeData: accountTypeData.data, accountGroupData: accountGroupData.data, clientData: clientData.data, categoryData: categoryData.data, subCategoryData: subCategoryData.data }
}

export const getStartDate = (startDate, monthsToAdd) => {
    var inputDate = new Date(startDate);
    inputDate.setMonth(inputDate.getMonth() + monthsToAdd);
    return inputDate.toISOString().split('T')[0];
}

export const getEndDate = (startDate, monthsToAdd) => {
    var inputDate = new Date(startDate);
    inputDate.setMonth(inputDate.getMonth() + monthsToAdd);
    inputDate.setDate(0);
    return inputDate.toISOString().split('T')[0];
}

export const getFiscalAndFrequencyYearMonth = (dateString, fiscalStartMonth, selectedFrequency) => {
    let startYear;
    let fiscalMonthYear;
    let fiscalId;
    let fiscalStartDate;
    let fiscalEndDate;
    let frequencyValue = 12;

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // Set Frequency Value
    if (selectedFrequency == 'quarterly') {
        frequencyValue = 3;
    } else if (selectedFrequency == 'semiannual') {
        frequencyValue = 6;
    }
    // Get Fiscal Year
    if (month < fiscalStartMonth) {
        startYear = year - 1;
    } else {
        startYear = year;
    }
    // Get fiscalStartDate Base on Start Year
    fiscalStartDate = `${startYear}-${String(fiscalStartMonth).padStart(2, '0')}-01`;

    if (frequencyValue === 12) {
        fiscalEndDate = getEndDate(fiscalStartDate, frequencyValue);
        fiscalId = `${startYear}-${String(startYear + 1).slice(2)}`;
        return {
            fiscalId,
            fiscalName: fiscalId,
            fiscalStartDate: new Date(fiscalStartDate),
            fiscalEndDate: new Date(fiscalEndDate)
        };
    }

    if (month < fiscalStartMonth) {
        fiscalMonthYear = 12 - fiscalStartMonth + month + 1;
    } else {
        fiscalMonthYear = month - fiscalStartMonth + 1;
    }

    const finalFrequencyValue = Math.ceil(fiscalMonthYear / frequencyValue);
    const getMonthsBasedOnFrequency = (finalFrequencyValue - 1) * frequencyValue;
    fiscalStartDate = getStartDate(fiscalStartDate, getMonthsBasedOnFrequency);
    fiscalEndDate = getEndDate(fiscalStartDate, frequencyValue);

    if (frequencyValue == 3) {
        fiscalId = `${startYear}-Q${finalFrequencyValue}`;
    } else if (frequencyValue == 6) {
        fiscalId = `${startYear}-H${finalFrequencyValue}`;
    }
    return {
        fiscalId,
        fiscalName: fiscalId.split('-').reverse().join(' '),
        fiscalStartDate: new Date(fiscalStartDate),
        fiscalEndDate: new Date(fiscalEndDate)
    };
}

export const fetchFiscalDate = (fiscalStartMonth) => {
    const currentFiscalData = getFiscalAndFrequencyYearMonth(new Date(), fiscalStartMonth, '')
    const lastYearDate = getStartDate(new Date(), -12)
    const lastFiscalData = getFiscalAndFrequencyYearMonth(lastYearDate, fiscalStartMonth, '')
    return { currentFiscalData, lastFiscalData }
}

export const getReportDateRange = (selectedValue, fiscalDate) => {
    let fromDate = new Date();
    let toDate = new Date();
    switch (selectedValue) {
        case 10:
            fromDate.setMonth(fromDate.getMonth() - 1);
            break;
        case 20:
            fromDate.setMonth(fromDate.getMonth() - 2);
            break;
        case 30:
            fromDate.setMonth(fromDate.getMonth() - 3);
            break;
        case 40:
            fromDate.setMonth(fromDate.getMonth() - 6);
            break;
        case 50:
            fromDate.setFullYear(fromDate.getFullYear() - 1);
            break;
        case 60:
            fromDate = fiscalDate.currentFiscal.fiscalStartDate
            toDate = fiscalDate.currentFiscal.fiscalEndDate
            break;
        case 70:
            fromDate = fiscalDate.lastFiscal.fiscalStartDate
            toDate = fiscalDate.lastFiscal.fiscalEndDate
            break;
        case 80:
            fromDate = fiscalDate.lastFiscal.fiscalStartDate
            toDate = fiscalDate.currentFiscal.fiscalEndDate
            break;
        // Add cases for other options as needed
        default:
            fromDate.setMonth(fromDate.getMonth() - 1);
            break;
    }
    return { fromDate, toDate }
}

export const remindMsg = () => {
    const user = (JSON.parse(localStorage.getItem('userData')))
    const { expiryDate, tenantDays } = getDecodedTokenValue()
    const formattedDate = formatDate(expiryDate)
    let title = '';
    let message = '';
    if (tenantDays !== null) {
        if (tenantDays > 0 && tenantDays <= tenantExpireWarningDays) {
            title = 'Your subscription expires soon '
            message = `Your subscription will expire in ${tenantDays} days on ${formattedDate}. Please renew it before expires to continue uninterrupted usage`;
        } else if (tenantDays === 0) {
            title = 'Your subscription expiring Today '
            message = 'Your subscription is expiring Today. Please renew it before expires to continue uninterrupted usage';
        } else if (tenantDays < 0) {
            title = 'Your subscription has expired '
            message = `Your subscription expired ${Math.abs(tenantDays)} days ago on ${formattedDate}. Please renew it to resume uninterrupted usage.`;
        }
    }
    if (user.tenantStatus === 0) {
        title = 'Your subscription is Suspended '
        message = `Your subscription is Suspended. Please Contact administator to resume uninterrupted usage.`;
    }
    return { title, message }
}