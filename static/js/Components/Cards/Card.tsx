import { Box, useStyleConfig } from '@chakra-ui/react';

const Card = (props: { [x: string]: any; variant?: any; }) => {
    const { variant, ...rest } = props;
    const styles = useStyleConfig('Card', { variant });
    return <Box __css={styles} {...rest} />;
}

export default Card;