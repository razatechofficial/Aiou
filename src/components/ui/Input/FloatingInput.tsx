import React, { forwardRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
  Pressable,
  Animated,
  type TextInputProps,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import { Controller, Control } from "react-hook-form";

interface FloatingInputProps extends Omit<TextInputProps, "onChange"> {
  label: string;
  error?: string;
  onChange?: (text: string) => void;
  isFileInput?: boolean;
  onFileSelect?: (result: DocumentPicker.DocumentPickerResult | null) => void;
  control?: Control<any>;
  name?: string;
}

export const FloatingInput = forwardRef<TextInput, FloatingInputProps>(
  (
    {
      label,
      error,
      secureTextEntry,
      onChange,
      onFileSelect,
      isFileInput = false,
      control,
      name = "",
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fileName, setFileName] = useState<string>("");
    const [hasContent, setHasContent] = useState(false);
    const finalSecureTextEntry = secureTextEntry && !showPassword;

    const animatedValue = new Animated.Value(hasContent || isFocused ? 1 : 0);

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: isFocused || hasContent || fileName ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isFocused, hasContent, fileName]);

    const labelStyle = {
      top: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [14, -10],
      }),
      fontSize: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
      }),
      color: error ? "#EF4444" : "#6B7280",
    };

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
      setHasContent(text.length > 0);
      onChange?.(text);
    };

    const handleFileSelect = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "*/*",
          multiple: false,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setFileName(result.assets[0].name);
          onFileSelect?.(result);
          onChange?.(result.assets[0].uri);
        }
      } catch (error) {
        console.error("Error picking document:", error);
      }
    };

    const clearFile = () => {
      setFileName("");
      onFileSelect?.(null);
      onChange?.("");
    };

    const renderFileInput = () => (
      <Pressable
        onPress={handleFileSelect}
        className={`
          w-full px-4 h-[52px] border rounded-lg flex-row items-center justify-between
          ${
            error
              ? "border-red-500"
              : isFocused
              ? "border-blue-500"
              : "border-gray-300 dark:border-gray-600"
          }
          ${
            props.editable === false
              ? "bg-gray-100 dark:bg-gray-700"
              : "bg-white dark:bg-gray-800"
          }
        `}
      >
        <View className="flex-row items-center flex-1">
          <Icon name="upload" size={18} color={error ? "#EF4444" : "#666666"} />
          <Text
            className="ml-2 text-gray-600 dark:text-gray-300 text-sm"
            numberOfLines={1}
          >
            {fileName || "Choose file"}
          </Text>
        </View>
        {fileName ? (
          <TouchableOpacity onPress={clearFile} className="p-2">
            <Icon name="times" size={16} color="#666666" />
          </TouchableOpacity>
        ) : null}
      </Pressable>
    );

    const renderTextInput = (field?: {
      onChange: (text: string) => void;
      value: string;
    }) => (
      <View className="relative w-full">
        <TextInput
          ref={ref}
          {...props}
          value={field?.value || value}
          onChangeText={(text) => {
            field?.onChange(text);
            handleChangeText(text);
          }}
          secureTextEntry={finalSecureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full px-4 h-[52px] border rounded-lg
            ${
              error
                ? "border-red-500"
                : isFocused
                ? "border-blue-500"
                : "border-gray-300 dark:border-gray-600"
            }
            ${
              props.editable === false
                ? "bg-gray-100 dark:bg-gray-700"
                : "bg-white dark:bg-gray-800"
            }
            text-gray-900 dark:text-gray-100 text-base
          `}
          placeholderTextColor="#9CA3AF"
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 h-full justify-center"
          >
            <Text>{showPassword ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        )}
      </View>
    );

    const renderContent = (field?: {
      onChange: (text: string) => void;
      value: string;
    }) => (
      <View className="w-full mb-4">
        <View className="relative">
          <Animated.Text
            className={`
              absolute z-10 left-4 px-1 bg-white dark:bg-gray-800
              ${props.editable === false ? "text-gray-400" : ""}
            `}
            style={labelStyle}
          >
            {isFileInput ? (
              <Icon
                name="upload"
                size={18}
                className="text-red-500"
                // color={error ? "#EF4444" : "#666666"}
              />
            ) : (
              ""
            )}{" "}
            {label}
          </Animated.Text>
          {isFileInput ? renderFileInput() : renderTextInput(field)}
        </View>
        {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      </View>
    );

    // Check if we need to use React Hook Form's Controller
    if (control && name) {
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState }) => {
            // Update hasContent based on field value
            useEffect(() => {
              setHasContent(field.value?.length > 0);
            }, [field.value]);

            return renderContent(field);
          }}
        />
      );
    }

    return renderContent();
  }
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
