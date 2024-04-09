// place files you want to import through the `$lib` alias in this folder.

import { formatDistanceToNow } from "date-fns";

export function formateDate(date: Date) {
	return formatDistanceToNow(date, {
		addSuffix: true
	});
}
