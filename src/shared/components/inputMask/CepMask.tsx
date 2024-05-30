import React, { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';
import { InputBaseComponentProps } from '@mui/material';

interface CustomProps extends InputBaseComponentProps {
    inputRef: React.Ref<HTMLInputElement>;
    name: string;
}

const CepMask = forwardRef<HTMLElement, CustomProps>(
    function CepMask(props : any, ref : any ) {
        const { inputRef, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="00000-000"
                definitions={{
                    '0': /[0-9]/,
                }}
                inputRef={(el) => {
                    if (el) {
                        (inputRef as React.MutableRefObject<HTMLInputElement>).current = el;
                        if (typeof ref === 'function') {
                            ref(el);
                        } else if (ref) {
                            (ref as React.MutableRefObject<HTMLInputElement>).current = el;
                        }
                    }
                }}
                onAccept={(value: any) => {
                    if (other.onChange) {
                        other.onChange({
                            target: {
                                name: props.name,
                                value,
                            },
                        } as any);
                    }
                }}
                overwrite
            />
        );
    }
);

export default CepMask;