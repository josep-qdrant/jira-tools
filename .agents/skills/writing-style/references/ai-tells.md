# AI tells: the full humanization catalog

The full practice behind the "Kill the AI tells" block in `SKILL.md`. The skill
inlines the hard-banned subset (the enforced minimum) so the rule applies even
when this file has not been read; this is the complete list and the judgment
calls a phrase grep cannot make.

Adapted for this repo's deliverables (audit cards, dossiers, synthesis docs,
sprint/triage notes). The catalog itself is generic; the scope below is ours.

## Scope: what these rules touch, and what they must not

Humanize **our prose**: the verdict rationale, the four-axis notes, risk and
incoherence descriptions, the TL;DR line, any free paragraph we write.

Leave alone (these are gated shape, not prose to "improve"):

| Humanize freely (our prose)              | Never restructure or "humanize" (gated)                       |
| ---------------------------------------- | ------------------------------------------------------------- |
| Verdict rationale, axis notes, risk text | Frontmatter, `> [!tldr]` / `> [!dor]` callouts, wikilinks     |
| Synthesis narrative, exec-summary lead   | Score arithmetic, master-table columns, counts                |
| Open-questions descriptions              | `Not recorded` / `Uncertain` tokens, `[NEEDS CLARIFICATION]`  |
| Phase / triage descriptions              | **Quoted Jira/Notion/Slack source text** (see below)          |

**Quoted source text is off limits.** When a card quotes a ticket description, a
Notion requirement, or a Slack message verbatim, that is evidence. Do not rewrite
it to sound human even if it is full of tells. That would alter the record and
break the no-invention rule. If the source itself reads like marketing, that is
a finding worth noting, not a thing to launder. Banned-phrase checks run on what
**we** wrote, not on quotes.

## What "human" means here, and what it does not

The goal is prose that reads like a person wrote it, not text engineered to fool a
detector. Detector-bypass writing is longer, hedgier, chattier; that fights our
deliverables, which want short sentences and no filler (see `SKILL.md` §3). Never
add words to sound human.

Human, for our deliverables, means:

- **Varied cadence.** Real writing mixes a four-word sentence with a twenty-word
  one. Generated text marches at a uniform fifteen. Break the march.
- **Concrete over abstract.** "The proto contract has no size field" beats "the
  contract lacks adequate field coverage."
- **No scaffolding.** Drop "Furthermore", "It is worth noting", "In essence",
  "This section will", and the "not just X, but Y" shape. Connective tissue a
  person would not type.
- **Broken parallelism.** Three bullets that all open with the same word read as a
  generated list. Vary the openers and shapes.
- **One voice.** Pick a subject (the ticket, the team, "you") and hold it.

Fewer words, not more. The naturalness comes from rhythm and specificity, never
from padding.

## 1. Banned phrases

These never appear in our prose. The mechanical entries are exact phrases the grep
in `SKILL.md` flags; the rest need a careful read.

| Banned                         | Why it reads as a tell               | Use instead                   |
| ------------------------------ | ------------------------------------ | ----------------------------- |
| delve                          | Nobody says it out loud              | look at, dig into             |
| tapestry                       | Decoration, carries no meaning       | (delete the sentence)         |
| in essence                     | Filler before a restatement          | (delete; state it once)       |
| navigate the landscape         | Abstract throat-clearing             | name the actual thing         |
| seamless, seamlessly           | Marketing, unmeasurable              | (delete or name the gain)     |
| intuitive                      | Asserts what the reader should judge | describe the behavior         |
| leverage (as a verb)           | Corporate for "use"                  | use                           |
| robust (without a number)      | Sounds strong, says nothing          | give the actual guarantee     |
| it is worth noting             | Filler before a point                | (delete; make the point)      |
| it should be noted             | Same                                 | (delete)                      |
| as previously mentioned        | The reader remembers                 | (delete)                      |
| furthermore, moreover          | Essay connective tissue              | (start the sentence plainly)  |
| additionally                   | Same                                 | also, or just continue        |
| cutting-edge, state-of-the-art | Marketing                            | (delete)                      |
| game-changer, revolutionary    | Marketing                            | (delete)                      |
| unlock, unleash, empower       | Marketing verbs                      | name the concrete capability  |
| at the end of the day          | Filler                               | (delete)                      |
| crucial, vital, essential      | Inflation without a stake            | say why it matters, or cut it |

The em dash deserves its own note: never use it in our prose. Replace it with a
comma, colon, semicolon, parentheses, or a sentence break. A hyphen is fine.

`leverage`, `robust`, and `intuitive` have rare legitimate uses (a quoted spec, a
measured "robust to N failures"). The grep flags them as candidates; confirm by
reading before deleting. When the fix is "delete the sentence", check the
paragraph still stands; it usually reads better with the filler gone and nothing
added.

## 2. Sentence-level tells

**The "not just X, but Y" shape.** A generation favorite. "This is not just a
backlog audit, it is a planning tool." Cut it to the claim you can support. If you
cannot support the bigger claim, you were inflating.

**Hedging stacks.** "This may potentially block some tickets in certain cases."
Each hedge weakens the statement. If the condition is real, name it. If not, state
it plainly. A single conditional "may" in a risk is fine; a stack is not. (This is
the same rule as `SKILL.md` §2 "no hedging stacks", spelled out.)

**The rule of three, every time.** "Faster, cheaper, and more reliable." A person
uses a triad sometimes; generated text uses it constantly. When the third item is
there only for rhythm, drop it.

**Restating the heading.** Under `## Goal clarity`, a sentence that opens "The goal
clarity of this ticket is..." wastes the reader's time. Start with the substance.
(Reinforces `SKILL.md` §4.)

**Future tense for current behavior.** "The card will list the risks." It lists
them. Use present tense.

## 3. Structural tells

These survive a phrase check and are the strongest signal a list was generated.

**Parallel openers.** Three or more bullets that begin with the same word.

Before:

```
- The ticket has no acceptance criteria.
- The ticket has no linked design.
- The ticket has no size estimate.
```

After (vary the opening, keep each bullet tight):

```
- No acceptance criteria recorded.
- Design: none linked in any of the five usual places.
- Size is unestimated, so the Score below rests on a guess.
```

**Uniform bullet length and shape.** When every bullet is a flat declarative of
the same length, the list reads mechanical even with varied openers. Mix a short
bullet with a longer one.

**Listicle-itis.** Prose broken into bullets that did not need to be a list. Three
short related statements often read better as two sentences. Bullets are for
genuinely parallel items. (See `SKILL.md` §5 on no-ops; an empty or padded bullet
is worse than no bullet.)

**Symmetric paragraphs.** Every paragraph the same length, each opening with the
subject. Real sections are lopsided. One paragraph runs long because the idea
needed it; the next is a single line.

## 4. Cadence and rhythm

The part a phrase list cannot catch, and the part that matters most.

Generated prose holds a steady sentence length, usually twelve to eighteen words,
sentence after sentence. Human prose does not. It lands a short sentence after a
long one. It opens with a subordinate clause once, then with the subject three
times, then with a question.

The fix is mechanical to start: after a long sentence, write a short one. Find the
two sentences in a paragraph that are the same length and shape, and change one.
You are not adding words; you are redistributing them. Keep any single sentence
under twenty-five words.

## A worked example

Before (an audit-card verdict that reads generated):

> In essence, this is a crucial and robust objective that empowers the team to
> seamlessly navigate the hybrid-cloud landscape. Furthermore, it leverages
> existing infrastructure to deliver a game-changing improvement.

Every clause is a tell.

After:

> The objective reuses the existing agent job-claiming path, so the work is
> mostly wiring, not new infrastructure. The catch: no acceptance criteria, so
> "done" is undefined and the M-size estimate is a guess.

Shorter, concrete, varied cadence, and every claim traces to the ticket. That is
the target.
