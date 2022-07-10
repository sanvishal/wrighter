import { Tooltip, TooltipProps } from "@chakra-ui/react";

export const CustomToolTip = ({ children, ...rest }: { children: JSX.Element | JSX.Element[] } & TooltipProps) => (
  <Tooltip {...rest} bg="tooltipBg" color="white" borderRadius={10} shadow="base" fontSize="small" fontWeight={"bold"}>
    {children}
  </Tooltip>
);
