import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import { CustomProps } from "../../modules/admin/usersManagement/types";

export const TextMaskCpfCnpj = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        const [mask, setMask] = useState('');

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value.replace(/[^\d]/g, '');
            const inputLength = inputValue.length;

            if (inputLength <= 11) {
                setMask('000.000.000-000');
            } else {
                setMask('00.000.000/0000-00');
            }

            onChange({ target: { name: props.name, value: inputValue } });
        }

        return (
            <IMaskInput
                {...other}
                mask={mask}
                definitions={{
                    '#': /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
                overwrite
                onChange={handleChange}
            />
        );
    },
);

export const TextMaskCep = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        const [mask, setMask] = useState('');

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value.replace(/[^\d]/g, '');
            setMask('00000-000');
            onChange({ target: { name: props.name, value: inputValue } });
        }

        return (
            <IMaskInput
                {...other}
                mask={mask}
                definitions={{
                    '#': /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
                overwrite
                onChange={handleChange}
            />
        );
    },
);

export const TextMaskTelephone = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        const [mask, setMask] = useState('');

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value.replace(/[^\d]/g, '');

            setMask('(00)00000-0000');

            onChange({ target: { name: props.name, value: inputValue } });
        }

        return (
            <IMaskInput
                {...other}
                mask={mask}
                definitions={{
                    '#': /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
                overwrite
                onChange={handleChange}
            />
        );
    },
);