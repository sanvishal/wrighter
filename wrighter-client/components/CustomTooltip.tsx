import { Tooltip, TooltipProps, useBreakpointValue } from "@chakra-ui/react";

export const CustomToolTip = ({ children, ...rest }: { children: JSX.Element | JSX.Element[] } & TooltipProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Tooltip {...rest} bg="tooltipBg" color="white" borderRadius={10} shadow="base" fontSize="small" isDisabled={isMobile}>
      {children}
    </Tooltip>
  );
};
