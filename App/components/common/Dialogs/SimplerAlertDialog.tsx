import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { BLUE_DARK } from '../../../constants/Colors';
import { TypographyFontFamily } from '../../ui/Typography';

export const SimpleAlertDialog = ({
    title,
    content,
    visible,
    dismissable,
    showOnlyNegative,
    showOnlyPositive,
    negativeAction,
    positiveAction,
    positiveButtonLabel,
    negativeButtonLabel,
    setVisible
}: {
    title: string;
    content: string;
    positiveButtonLabel?: string;
    negativeButtonLabel?: string;
    visible: boolean;
    dismissable: boolean;
    showOnlyNegative?: boolean;
    showOnlyPositive?: boolean;
    negativeAction: Function;
    positiveAction: Function;
    setVisible: Function;
}) => {
    return (
        <View>
            <Portal>
                <Dialog
                    style={{ backgroundColor: '#f6f8fb' }}
                    visible={visible}
                    dismissable={dismissable}
                    onDismiss={() => setVisible(false)}
                >
                    <Dialog.Title style={styles.dialogTitle}>
                        {title}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={styles.paragraph}>
                            {content}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        {!showOnlyNegative && (
                            <Button
                                labelStyle={styles.positiveButtonLabel}
                                onPress={() => positiveAction()}
                            >
                                {positiveButtonLabel}
                            </Button>
                        )}
                        {!showOnlyPositive && (
                            <Button
                                mode="outlined"
                                style={styles.negativeButtonStyle}
                                labelStyle={styles.negativeButtonLabel}
                                onPress={() => negativeAction()}
                            >
                                {negativeButtonLabel}
                            </Button>
                        )}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    dialogTitle: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.heavy
    },
    negativeButtonLabel: {
        color: 'white',
        fontFamily: TypographyFontFamily.medium,
        fontSize: 12
    },
    negativeButtonStyle: {
        backgroundColor: BLUE_DARK,
        marginEnd: 10,
        marginStart: 20
    },
    paragraph: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.medium
    },
    positiveButtonLabel: {
        color: 'grey',
        fontFamily: TypographyFontFamily.medium
    }
});
