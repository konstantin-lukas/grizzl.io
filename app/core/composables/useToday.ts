import { getLocalTimeZone, today } from "@internationalized/date";
import useLocale from "~/core/composables/useLocale";

export default function useToday() {
    const month = ref();
    const { language } = useLocale();

    const setToday = () => {
        const timeZone = getLocalTimeZone();
        const now = today(timeZone);
        month.value = new Intl.DateTimeFormat(language.value, { month: "long", timeZone }).format(now.toDate(timeZone));
    };

    onMounted(setToday);
    watch(language, setToday);

    return { month };
}
