import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import tw from 'twin.macro';

type AlertButtonRole = 'destructive' | 'primary' | 'secondary';

const StyledAlertutton = styled.div<{ role: AlertButtonRole }>`
  ${tw`w-1/2 p-2 cursor-pointer transition-all md:hover:bg-[rgba(212,211,211,0.24)] text-center `}
  ${({ role }) => {
    switch (role) {
      case 'destructive':
        return tw`text-red-500 `;
      case 'primary':
        return tw`text-blue-500 font-bold`;
      case 'secondary':
        return tw`text-blue-500`;
    }
  }}
`;

interface AlertRowProps {
  onClick?: () => void;
  role?: AlertButtonRole;
}

const AlertButton = (props: AlertRowProps & PropsWithChildren) => {
  const { onClick, role = 'secondary', children } = props;

  return (
    <StyledAlertutton onClick={onClick} role={role}>
      {children}
    </StyledAlertutton>
  );
};

export default AlertButton;
