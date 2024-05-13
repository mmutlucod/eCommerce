import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (x, i) => {
    const month = i + 1;
    return month <= 9 ? '0' + month : month;
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);

export default function CForm({
    cardMonth,
    cardYear,
    onUpdateState,
    cardNumberRef,
    cardHolderRef,
    cardDateRef,
    onCardInputFocus,
    onCardInputBlur,
    cardCvv,
    children
}) {
    const [cardNumber, setCardNumber] = useState('');

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        onUpdateState(name, value);
    };

    const onCardNumberChange = (event) => {
        let { value, name } = event.target;
        let cardNumber = value;
        value = value.replace(/\D/g, '');
        if (/^3[47]\d{0,13}$/.test(value)) {
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        } else if (/^\d{0,16}$/.test(value)) {
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
                .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
        }

        setCardNumber(cardNumber.trimRight());
        onUpdateState(name, cardNumber);
    };

    const onCvvFocus = (event) => {
        onUpdateState('isCardFlipped', true);
    };

    const onCvvBlur = (event) => {
        onUpdateState('isCardFlipped', false);
    };

    return (
        <Box className="card-form" sx={{ maxWidth: 400, margin: '0 auto' }}>
            <div className="card-list" style={{ marginBottom: '20px' }}>{children}</div>
            <div className="card-form__inner">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Kart Numarası"
                            variant="standard"
                            fullWidth
                            name="cardNumber"
                            onChange={onCardNumberChange}
                            inputRef={cardNumberRef}
                            onFocus={(e) => onCardInputFocus(e, 'cardNumber')}
                            onBlur={onCardInputBlur}
                            value={cardNumber}
                            inputProps={{ maxLength: 16 }} // Max 16 karakter
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Kart Sahibi"
                            variant="standard"
                            fullWidth
                            name="cardHolder"
                            onChange={handleFormChange}
                            inputRef={cardHolderRef}
                            onFocus={(e) => onCardInputFocus(e, 'cardHolder')}
                            onBlur={onCardInputBlur}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel>Ay</InputLabel>
                            <Select
                                label="Ay"
                                value={cardMonth}
                                name="cardMonth"
                                onChange={handleFormChange}
                                inputRef={cardDateRef}
                                onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                                onBlur={onCardInputBlur}
                            >
                                {monthsArr.map((val, index) => (
                                    <MenuItem key={index} value={val}>
                                        {val}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel>Yıl</InputLabel>
                            <Select
                                label="Yıl"
                                value={cardYear}
                                name="cardYear"
                                onChange={handleFormChange}
                                onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                                onBlur={onCardInputBlur}
                            >
                                {yearsArr.map((val, index) => (
                                    <MenuItem key={index} value={val}>
                                        {val}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="CVV"
                            variant="standard"
                            fullWidth
                            name="cardCvv"
                            onChange={handleFormChange}
                            onFocus={onCvvFocus}
                            onBlur={onCvvBlur}
                            inputRef={cardCvv}
                            inputProps={{ maxLength: 4 }} // Max 4 karakter
                        />
                    </Grid>
                </Grid>
            </div>
        </Box>
    );
}
