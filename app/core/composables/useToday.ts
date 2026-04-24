import { type CalendarDate, getLocalTimeZone, today as now } from "@internationalized/date";
import useLocale from "~/core/composables/useLocale";

export default function useToday() {
    const monthName = ref<string | null>(null);
    const timeZone = ref<string | null>(null);
    const today = ref<CalendarDate | null>(null);
    const { language } = useLocale();

    const setToday = () => {
        timeZone.value = getLocalTimeZone();
        today.value = now(timeZone.value);
        monthName.value = new Intl.DateTimeFormat(language.value, { month: "long", timeZone: timeZone.value }).format(
            today.value.toDate(timeZone.value),
        );
    };

    onMounted(setToday);
    watch(language, setToday);

    return { monthName, today, timeZone };
}
