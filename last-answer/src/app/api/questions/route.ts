import { NextResponse } from "next/server";
import { defaultBattleQuestions } from "@/game/core/questions";

const DEFAULT_QUESTION_AMOUNT = 10;

type OpenTriviaResponse = {
  response_code?: number;
  results?: unknown[];
};

function fallbackQuestionsResponse() {
  return NextResponse.json({ questions: defaultBattleQuestions });
}

function normalizeAmount(amount: unknown) {
  const normalizedAmount =
    typeof amount === "number"
      ? amount
      : typeof amount === "string"
        ? Number(amount)
        : Number.NaN;

  return Number.isInteger(normalizedAmount) && normalizedAmount > 0
    ? String(normalizedAmount)
    : String(DEFAULT_QUESTION_AMOUNT);
}

function appendOptionalParam(
  params: URLSearchParams,
  key: string,
  value: unknown,
) {
  if (value === null || value === undefined) {
    return;
  }

  const normalizedValue = String(value).trim();
  if (normalizedValue.length > 0) {
    params.set(key, normalizedValue);
  }
}

/* demo response from the url*/
/* {"response_code":0,"results":[{"type":"multiple","difficulty":"medium","category":"Entertainment: Music","question":"Who recorded the album called &quot;Down to the Moon&quot; in 1986?","correct_answer":"Andreas Vollenweider","incorrect_answers":["Jean-Michel Jarre","Bing Crosby","Enya"]},{"type":"multiple","difficulty":"medium","category":"Science: Computers","question":"What is the number of keys on a standard Windows Keyboard?","correct_answer":"104","incorrect_answers":["64","94","76"]},{"type":"multiple","difficulty":"easy","category":"Science: Computers","question":"On a standard American QWERTY keyboard, what symbol will you enter if you hold the shift key and press 1?","correct_answer":"Exclamation Mark","incorrect_answers":["Dollar Sign","Percent Sign","Asterisk"]},{"type":"multiple","difficulty":"easy","category":"Entertainment: Music","question":"Which group performs the song &quot;Crash into Me&quot;?","correct_answer":"Dave Matthews Band","incorrect_answers":["Phish","The Grateful Dead","Destiny&#039;s Child"]},{"type":"boolean","difficulty":"hard","category":"Entertainment: Video Games","question":"The Paradox Interactive game &quot;Stellaris&quot; was released in 2016.","correct_answer":"True","incorrect_answers":["False"]},{"type":"multiple","difficulty":"medium","category":"General Knowledge","question":"The architect known as Le Corbusier was an important figure in what style of architecture?","correct_answer":"Modernism","incorrect_answers":["Neoclassical","Baroque","Gothic Revival"]},{"type":"multiple","difficulty":"medium","category":"History","question":"What was the capital of South Vietnam before the Vietnam War?","correct_answer":"Saigon","incorrect_answers":["Ho Chi Minh City","Hanoi","Hue"]},{"type":"multiple","difficulty":"hard","category":"History","question":"What was the code name for the Allied invasion of Southern France on August 15th, 1944?","correct_answer":"Operation Dragoon","incorrect_answers":["Operation Overlord","Operation Market Garden","Operation Torch"]},{"type":"multiple","difficulty":"easy","category":"Entertainment: Video Games","question":"In Pokemon, the ability Wonder Guard is exclusive to which Pokemon? ","correct_answer":"Shedinja ","incorrect_answers":["Sableye","Spiritomb","Silvally "]},{"type":"boolean","difficulty":"easy","category":"Entertainment: Video Games","question":"In Until Dawn, both characters Sam and Mike cannot be killed under any means until the final chapter of the game.","correct_answer":"True","incorrect_answers":["False"]}]} */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const amount = requestUrl.searchParams.get("amount");
  const category = requestUrl.searchParams.get("category");
  const difficulty = requestUrl.searchParams.get("difficulty");
  const type = requestUrl.searchParams.get("type");

  const params = new URLSearchParams({ amount: normalizeAmount(amount) });
  appendOptionalParam(params, "category", category);
  appendOptionalParam(params, "difficulty", difficulty);
  appendOptionalParam(params, "type", type);

  try {
    const response = await fetch(`https://opentdb.com/api.php?${params}`);
    if (!response.ok) {
      return fallbackQuestionsResponse();
    }

    const data: OpenTriviaResponse | null = await response
      .json()
      .catch(() => null);

    if (
      data?.response_code !== 0 ||
      !Array.isArray(data.results) ||
      data.results.length === 0
    ) {
      return fallbackQuestionsResponse();
    }

    return NextResponse.json({ questions: data.results });
  } catch {
    return fallbackQuestionsResponse();
  }
}
