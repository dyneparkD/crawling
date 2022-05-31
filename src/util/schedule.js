const schedule = require("node-schedule");
const { getUpdatedList, UpdateNaver } = require("../crawl/naver");

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3000 });
const key = "updatedCount";

console.log("scheduler is running");

schedule.scheduleJob("* * * * *", async () => {
  const [$, $webtoonList] = await getUpdatedList();
  const length = $webtoonList.length;
  const cachedLength = cache.get(key);
  let time = new Date();

  if (length !== cachedLength) {
    cache.set(key, length);
    const webtoons = await UpdateNaver();
    cache.set("/webtoons", webtoons);
    console.log(
      `[Update] Naver WebtoonList | length = ${length} | ${time.toString()}`
    );
  } else {
    console.log(`[No update] | length = ${cachedLength} | ${time.toString()}`);
  }
});

module.exports = { cache };
