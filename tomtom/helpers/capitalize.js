export default function (phrase) {  // the quick brown fox

	let ph_seg = phrase.split(' ');
	let new_ver = "";
	for (let word of ph_seg) {
		new_ver += word.charAt(0).toUpperCase() + word.substr(1) + " ";
	}
	return new_ver.trimEnd();
};