window._trainerData_introAI = [
  {
    "section": "02: Intelligent Agents",
    "question": "Ein Schachspiel ist eine kontinuierliche Umgebung.",
    "type": "tf",
    "answer": false,
    "explanation": "Schach ist eine diskrete Umgebung (discrete environment), da es eine endliche Anzahl klar definierter Zustände und Aktionen gibt."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Rationale Agenten haben immer alle relevanten Informationen.",
    "type": "tf",
    "answer": false,
    "explanation": "Rationale Agenten maximieren den erwarteten Nutzen basierend auf ihrer Wahrnehmungsfolge (percept sequence) und ihrem Vorwissen; sie sind nicht zwingend allwissend (omniscient)."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Ein Agent, der nur Teilinformationen über den Zustand wahrnimmt, kann nicht rational sein.",
    "type": "tf",
    "answer": false,
    "explanation": "Auch bei unvollständiger Beobachtbarkeit (partial observability) kann ein Agent rational handeln, indem er die Aktion wählt, die den erwarteten Nutzen maximiert."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Ein rationaler Poker-Spieleragent verliert niemals.",
    "type": "tf",
    "answer": false,
    "explanation": "Poker ist stochastisch und teilweise unbeobachtbar. Auch die mathematisch beste Entscheidung kann durch Pech zum Verlust führen."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Es wird angenommen, dass rationale Agenten allwissend sind.",
    "type": "tf",
    "answer": false,
    "explanation": "Rationalität (rationality) ist nicht gleichbedeutend mit Allwissenheit (omniscience)."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Ein rationaler Agent wählt nie eine Aktion, deren tatsächlicher Gewinn bezüglich seines Performanzkriteriums suboptimal ist.",
    "type": "tf",
    "answer": false,
    "explanation": "Der Agent optimiert den *erwarteten* Gewinn. Da er die Zukunft in stochastischen Umgebungen nicht perfekt vorhersagen kann, kann der *tatsächliche* Gewinn im Nachhinein suboptimal ausfallen."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Die grundlegenden Komponenten eines rationalen Agenten sind Architektur, Programm und explizite Ziele.",
    "type": "tf",
    "answer": false,
    "explanation": "Explizite Ziele (explicit goals) sind nicht bei jedem Agententyp vorhanden. Reflexagenten oder nutzenbasierte Agenten (utility-based agents) haben keine festen Boolean-Ziele."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Ein nutzenbasierter Agent erreicht immer das Ziel mit dem größten Nutzen (falls es erreichbar ist).",
    "type": "tf",
    "answer": false,
    "explanation": "Er wählt die Aktion, die den *erwarteten* Nutzen (expected utility) maximiert. Stochastische Umweltfaktoren können das tatsächliche Erreichen verhindern."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Die Aktionen eines rationalen Agenten sind ausschließlich von seiner Wahrnehmungsfolge und eingebautem Wissen abhängig.",
    "type": "tf",
    "answer": false,
    "explanation": "Rationalität hängt auch vom Performance Measure und den verfügbaren Aktionen ab."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "In einer stochastischen Umgebung wird der nächste Zustand nur durch die ausgeführte Aktion beeinflusst.",
    "type": "tf",
    "answer": false,
    "explanation": "In stochastischen Umgebungen spielen Zufallskomponenten bzw. Unsicherheiten beim Zustandsübergang eine Rolle."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Ein rationaler Agent wählt nicht unbedingt immer die bestmögliche Aktion.",
    "type": "tf",
    "answer": true,
    "explanation": "Per Definition wählt ein rationaler Agent *immer* die Aktion, die basierend auf seinem Wissen und Wahrnehmungen optimal ist, allerdings kann diese auch nicht immer die bestmögliche sein (Beispielsweise Pokeragent weiß nicht alle Karten)."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Eine Pokerpartie ist eine diskrete Umgebung.",
    "type": "tf",
    "answer": true,
    "explanation": "Karten und Spielzüge sind abzählbar und endlich (discrete)."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Erklären sie den Begriff Rationaler Agent.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Ein rationaler Agent (rational agent) wählt stets die Aktion, die seinen erwarteten Leistungsmaßstab (expected performance measure) maximiert, basierend auf seiner bisherigen Wahrnehmungssequenz (percept sequence) und seinem internen Wissen."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Nennen Sie die 4 Komponenten der PEAS Description eines Agents. Geben Sie ein Beispiel für jede Komponente.",
    "type": "flashcard",
    "answer": null,
    "explanation": "PEAS steht für: Performance measure (Leistungsmaßstab, z.B. Sicherheit bei einem autonomen Auto), Environment (Umgebung, z.B. Straßen), Actuators (Aktuatoren, z.B. Lenkrad), Sensors (Sensoren, z.B. Kamera)."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Erklären Sie die folgenden Eigenschaften von Umgebungen: teilweise beobachtbar, deterministisch, diskret und statisch.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Partially observable (teilweise beobachtbar): Sensoren erfassen nicht den kompletten Zustand der Umgebung. Deterministic (deterministisch): Der Folgezustand ist durch den aktuellen Zustand und die Aktion eindeutig bestimmt. Discrete (diskret): Endliche Anzahl an Zuständen, Wahrnehmungen und Aktionen. Static (statisch): Die Umgebung ändert sich nicht, während der Agent überlegt."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Erklären Sie das Konzept eines zielbasierten Agenten und eines nutzenbasierten Agenten. Inwiefern unterscheiden sie sich?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Ein zielbasierter Agent (goal-based agent) wählt Aktionen rein mit dem Zweck, einen vordefinierten Zielzustand zu erreichen. Ein nutzenbasierter Agent (utility-based agent) optimiert zusätzlich eine Nutzenfunktion (utility function), um Zustände qualitativ (\"wie gut/glücklich\") zu bewerten. Dies ermöglicht Entscheidungen bei konkurrierenden oder unsicheren Zielen."
  },
  {
    "section": "02: Intelligent Agents",
    "question": "Nennen Sie die 4 Komponenten der Task Description eines Agents. Geben Sie ein Beispiel für jede Komponente.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Die Task Description (auch PEAS) eines Agenten besteht aus: 1. Performance measure (Leistungsmaßstab, z.B. Sicherheit), 2. Environment (Umgebung, z.B. Straßen), 3. Actuators (Aktuatoren, z.B. Lenkrad), 4. Sensors (Sensoren, z.B. Kamera). Task Description und PEAS Description bezeichnen dasselbe Konzept."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Iterative Deepening Search ist bei beliebigen (nicht-negativen) Kosten optimal.",
    "type": "tf",
    "answer": false,
    "explanation": "IDS ist nur optimal, wenn die Schrittkosten (step costs) für alle Kanten identisch sind."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Der von Uniform cost search zurückgegebene Pfad kann sich ändern, wenn wir zu den Kosten jedes Schritts eine positive Konstante C addieren.",
    "type": "tf",
    "answer": true,
    "explanation": "Pfade mit mehr Schritten werden dadurch im Vergleich zu kürzeren Pfaden überproportional bestraft, was die optimale Route (optimal path) ändern kann."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Depth-first search ist optimal wenn der Suchbaum endlich ist.",
    "type": "tf",
    "answer": false,
    "explanation": "DFS (Tiefensuche) findet die linkste Lösung im Baum, unabhängig davon, ob es auf einer anderen Ebene eine günstigere oder flachere Lösung gäbe."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Wenn die Kosten jeder Kante gleich sind, ist Breadth-first search optimal.",
    "type": "tf",
    "answer": true,
    "explanation": "BFS (Breitensuche) expandiert Knoten strikt nach ihrer Tiefe, was bei einheitlichen Kosten der Optimalität entspricht."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "DFS ist vollständig, wenn jeder mögliche Zustand in endlich vielen Schritten erreicht werden kann.",
    "type": "tf",
    "answer": false,
    "explanation": "Die Baumsuche-Variante von DFS kann bei Zyklen in Endlosschleifen geraten, selbst wenn das Ziel eigentlich erreichbar wäre."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Iterative Deepening Search besucht in einem endlichen Suchraum für eine optimale Lösung so wenig Knoten wie möglich.",
    "type": "tf",
    "answer": false,
    "explanation": "IDS verrichtet durch das wiederholte Neustarten mehrfache Arbeit für die oberen Knotenebenen. Algorithmen wie A* mit konsistenter Heuristik (consistent heuristic) besuchen ein Minimum an Knoten."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Die Uniform Cost Search mit Lösungstest bei der Erzeugung ist im Allgemeinen nicht vollständig.",
    "type": "tf",
    "answer": true,
    "explanation": "UCS ist vollständig, sofern die Kantenkosten strikt größer null sind. Ein Lösungstest bei Generierung (generation time) macht den Algorithmus unter Umständen suboptimal, aber nicht unvollständig."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Erklären sie den Begriff Uninformed Search.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Eine uninformierte Suche (uninformed search / blind search) nutzt keine problemspezifischen Informationen (wie Heuristiken) über den Abstand zum Ziel, sondern generiert und traversiert den Suchbaum ausschließlich mit den gegebenen Problemodelleigenschaften (Zustände und Aktionen)."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Erklären Sie die Begriffe Completeness, Optimality, Time complexity, und Space complexity im Kontext von Suchalgorithmen.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Completeness (Vollständigkeit): Der Algorithmus findet garantiert eine Lösung, falls eine existiert. Optimality (Optimalität): Die gefundene Lösung hat die geringsten Pfadkosten. Time complexity (Zeitkomplexität): Benötigte Zeit bzw. Anzahl der generierten Knoten. Space complexity (Speicherkomplexität): Maximal im Speicher gehaltener Zustandsbaum während der Ausführung."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Beschreiben Sie kurz die Depth-First-Suche (DFS) und Iterative-Deepening-Suche (IDS) inklusive Komplexitäten.",
    "type": "flashcard",
    "answer": null,
    "explanation": "DFS (Tiefensuche) expandiert stets den tiefsten Knoten im Randbereich (frontier). Time: O(b^m), Space: O(bm) (mit b = Verzweigungsfaktor, m = max. Tiefe). Weder optimal noch complete in unendlichen Bäumen. IDS (Iterative Tiefensuche) wendet DLS (Depth-Limited Search) iterativ mit steigendem Tiefenlimit an. Time: O(b^d), Space: O(bd) (mit d = Zieltief). IDS verbindet den linearen Speicherplatz von DFS mit der Vollständigkeit und Optimalität (bei konstanten Schrittkosten) von BFS (Breitensuche)."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Beschreiben Sie kurz die Uniform-cost-Suche (UCS) und die tiefenbeschränkte Suche (DLS). Geben Sie die worst-case Zeit- und Speicherkomplexitäten in big-O Notation an. Sind diese Algorithmen immer vollständig bzw. optimal?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Uniform-Cost Search (UCS) expandiert immer den Knoten mit den geringsten Pfadkosten. Zeit- und Speicherkomplexität: O(b^{1+⌊ C^*/ε ⌋}). UCS ist vollständig (complete) und optimal, sofern die Schrittkosten strikt positiv sind. Depth-Limited Search (DLS) ist eine Tiefensuche (depth-first search) mit einem Limit l. Zeit: O(b^l), Speicher: O(bl). DLS ist weder optimal noch vollständig (falls das Ziel tiefer als l liegt)."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Beschreiben Sie kurz die A*-Suche und die Depth-First Suche (DFS). Geben Sie die worst-case Zeit- und Speicherkomplexitäten an. Sind diese Algorithmen immer vollständig bzw. optimal?",
    "type": "flashcard",
    "answer": null,
    "explanation": "A*-Suche (A* search) kombiniert die Pfadkosten g(n) und die Heuristik h(n) mit f(n) = g(n) + h(n). Zeit- und Speicherkomplexität sind im Worst Case exponentiell. A* ist vollständig und optimal, wenn die Heuristik zulässig (admissible) ist. DFS expandiert immer den tiefsten Knoten im Randbereich (frontier). Zeit: O(b^m), Speicher: O(bm). DFS ist weder vollständig (kann in unendlichen Pfaden hängenbleiben) noch optimal."
  },
  {
    "section": "03: Problem Solving and Search (I)",
    "question": "Erklären Sie den Begriff Vollständigkeit (Completeness) eines Suchalgorithmus.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Ein Suchalgorithmus ist vollständig (complete), wenn er garantiert eine Lösung findet, sofern eine existiert. Bei endlichen Zustandsräumen ist dies meist gegeben, bei unendlichen Bäumen (z.B. DFS) jedoch nicht zwingend."
  },
  {
    "section": "04: Problem Solving and Search (II)",
    "question": "In einem endlichen Suchraum, der keinen Zielzustand enthält, untersucht der A* Algorithmus (bei Graph-Search) immer alle erreichbaren Zustände.",
    "type": "tf",
    "answer": true,
    "explanation": "Ohne Zielbedingung muss A* den kompletten erreichbaren Graphen abarbeiten (exhaustion), bis die Frontier leer ist."
  },
  {
    "section": "04: Problem Solving and Search (II)",
    "question": "Für konsistente Heuristikfunktionen h ist der A*-Algorithmus optimal.",
    "type": "tf",
    "answer": true,
    "explanation": "Eine konsistente Heuristik (consistent heuristic) garantiert bei Graphensuche, dass A* das Optimum findet."
  },
  {
    "section": "04: Problem Solving and Search (II)",
    "question": "Erklären sie den Begriff Admissible heuristic.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Eine zulässige Heuristik (admissible heuristic) überschätzt niemals die tatsächlichen Kosten, um von einem gegebenen Knoten das Ziel zu erreichen. Formal: h(n) ≤ h^*(n)."
  },
  {
    "section": "04: Problem Solving and Search (II)",
    "question": "Wann wird eine Heuristikfunktion als konsistent bezeichnet?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Eine Heuristik ist konsistent (consistent / monotonic), wenn für jeden Knoten n und jeden seiner Nachfolger n' gilt, dass die Heuristikkosten von n nicht größer sind als die Schrittkosten (step costs) zu n' plus die Heuristikkosten von n'. Formal: h(n) ≤ c(n, a, n') + h(n')."
  },
  {
    "section": "04: Problem Solving and Search (II)",
    "question": "Wann dominiert eine zulässige Heuristik h1 eine andere zulässige Heuristik h2?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Eine Heuristik h_1 dominiert h_2, wenn beide zulässig sind und für alle Knoten n gilt: h_1(n) ≥ h_2(n). A^* mit der dominierenden Heuristik expandiert garantiert maximal gleich viele oder weniger Knoten."
  },
  {
    "section": "04: Problem Solving and Search (II)",
    "question": "Beweisen oder widerlegen Sie, dass wenn beliebige Heuristiken h1 und h2 monoton (konsistent) sind, dann ist h(n) = max{h1(n), h2(n)} auch monoton (konsistent).",
    "type": "flashcard",
    "answer": null,
    "explanation": "Die Aussage ist wahr. Wenn h_1 und h_2 konsistent (consistent / monotonic) sind, erfüllen beide die Dreiecksungleichung: h_i(n) ≤ c(n, a, n') + h_i(n'). Nimmt man das Maximum beider Heuristiken, wird diese Ungleichung für den neuen Wert h(n) niemals verletzt. Das Maximum mehrerer konsistenter Heuristiken (admissible heuristics) ist somit stets selbst konsistent und dominiert (dominates) die Einzelheuristiken."
  },
  {
    "section": "04: Problem Solving and Search (II)",
    "question": "Wann wird eine Heuristikfunktion als konsistent (consistent) bezeichnet? Geben Sie eine formal korrekte Definition. Unter welcher Bedingung für a, b ≥ 0 ist h(n) = a·h1(n) + b·h2(n) sicher konsistent, wenn h1 und h2 konsistent sind?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Eine Heuristik h ist konsistent, wenn für jeden Knoten n, jeden Nachfolger n' und jede angewandte Aktion a gilt: h(n) ≤ c(n, a, n') + h(n') [1]. Die Linearkombination h(n) = a · h_1(n) + b · h_2(n) ist sicher konsistent, wenn a + b ≤ 1 gilt. Setzt man die Formeln ein, erhält man: a·h_1(n) + b·h_2(n) ≤ a·(c(n, a, n') + h_1(n')) + b·(c(n, a, n') + h_2(n')) = (a+b)·c(n, a, n') + h(n'). Damit der Term (a+b)·c(n, a, n') nicht größer wird als c(n, a, n') und die Dreiecksungleichung erhalten bleibt, muss zwingend a + b ≤ 1 gelten."
  },
  {
    "section": "04: Problem Solving and Search (II)",
    "question": "Beweisen oder widerlegen Sie: Die Heuristik in Aufgabe d) ist zulässig. Die Heuristik in Aufgabe d) ist konsistent.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Diese Aufgabe ist kontextabhängig (bezieht sich auf eine konkrete Heuristik aus Aufgabe d desselben Tests). Für den Beweis der Zulässigkeit (admissibility) muss gezeigt werden, dass h(n) ≤ h^*(n) für alle n gilt. Für die Konsistenz (consistency) muss h(n) ≤ c(n, a, n') + h(n') für alle Kanten gelten. Jede konsistente Heuristik ist auch zulässig, aber nicht umgekehrt."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Hill-Climbing mit zufälligem Neustart kann lokale Maxima überwinden.",
    "type": "tf",
    "answer": true,
    "explanation": "Durch Random-Restarts entkommt der Algorithmus lokalen Optima."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Lokale Suchmethoden können keine optimalen Lösungen finden.",
    "type": "tf",
    "answer": false,
    "explanation": "Sie können durchaus optimale Lösungen finden, sie bieten in der Basisvariante lediglich keine theoretische Garantie dafür."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Simulated Annealing kann nicht lokale Maxima überwinden.",
    "type": "tf",
    "answer": false,
    "explanation": "Die Kernidee von Simulated Annealing ist es, mit einer sinkenden Wahrscheinlichkeit (Temperatur) temporär schlechtere Zustände zu akzeptieren, um lokale Maxima zu verlassen."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Bei dem Local Beam Search-Algorithmus werden statt einem k Zustände verwaltet.",
    "type": "tf",
    "answer": true,
    "explanation": "Der Algorithmus verfolgt die k besten Nachfolgeknoten simultan."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Random-restart hill climbing wird bei genügend Zeit immer das globale Optimum finden.",
    "type": "tf",
    "answer": true,
    "explanation": "Bei unendlich vielen Neustarts strebt die Wahrscheinlichkeit, das globale Optimum zu finden, gegen 1."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Local Beam Search erweitert genetischen Algorithmen mit der \"Crossover\"-Funktion.",
    "type": "tf",
    "answer": false,
    "explanation": "Es ist genau umgekehrt. Genetische Algorithmen (genetic algorithms) erweitern Local Beam Search um die Crossover-Operation (Kombination von Zuständen)."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Simulated Annealing entspricht stochastischem Hill-Climbing",
    "type": "tf",
    "answer": false,
    "explanation": "Stochastisches Hill-Climbing wählt rein zufällig aus aufwärts gerichteten Schritten. Simulated Annealing erlaubt hingegen aktiv Abwärts-Schritte, abhängig vom Temperaturparameter."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Local Beam Search entspricht einer lokal begrenzten Ausführung von k Random-Restart Suchen.",
    "type": "tf",
    "answer": false,
    "explanation": "Bei Random-Restart laufen die Durchläufe strikt isoliert. Bei Beam Search kommunizieren die k Suchpfade, da für die nächste Iteration aus *allen* generierten Nachfolgern global die besten k gewählt werden."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Die Backtracking-Suche ist ein uninformierter Suchalgorithmus.",
    "type": "tf",
    "answer": true,
    "explanation": "Backtracking (Tiefensuche für CSPs) verfügt in seiner Reinform über keine Heuristiken bezüglich Lösungsdistanzen."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Beschreiben Sie die Funktionsweise von Hill-Climbing und ein Problem, das auftreten kann.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Hill-Climbing (Bergsteigen) ist eine lokale Suche, die iterativ den besten benachbarten Zustand (höchster Wert / niedrigste Kosten) auswählt, bis kein Nachbar mehr besser ist. Problem: Der Algorithmus kann in lokalen Optima (local maxima) stecken bleiben. Lösung: Random-Restart Hill-Climbing."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Beschreiben Sie Simulated Annealing.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Simulated Annealing kombiniert Hill-Climbing mit Elementen eines Random Walks. Schlechter bewertete Zustände werden mit einer bestimmten Wahrscheinlichkeit akzeptiert, um lokale Optima zu entkommen. Diese Wahrscheinlichkeit sinkt im Laufe der Zeit, gesteuert durch einen Temperatur-Parameter (temperature schedule)."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Beschreiben Sie das Funktionsprinzip von genetischen Algorithmen.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Genetic algorithms simulieren die natürliche Evolution. Sie starten mit einer Population von Zuständen (Individuen), bewerten diese über eine Fitnessfunktion (fitness function) und generieren die nächste Generation durch Selektion, Rekombination (crossover) und Mutation. Crossover ist besonders hilfreich, wenn sinnvolle Teillösungen (building blocks) existieren, die kombiniert werden können."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Welchen Nachteil hat Simulated Annealing im Allgemeinen?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Der größte Nachteil von Simulated Annealing ist die Schwierigkeit, einen passenden Temperaturverlauf (temperature schedule) zu finden. Sinkt die Temperatur zu langsam, dauert die Suche extrem lange (hohe Zeitkomplexität). Sinkt sie zu schnell, verhält sich der Algorithmus wie ein normales Hill-Climbing und bleibt in lokalen Optima (local maxima) stecken."
  },
  {
    "section": "05: Problem Solving and Search (III)",
    "question": "Beschreiben Sie das Funktionsprinzip von Hill Climbing. Welche Lösungen werden erzeugt und unter welchen Bedingungen findet man mit Hill Climbing keine Lösung?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Hill Climbing bewegt sich iterativ zum jeweils besten Nachbarzustand (höchster Heuristikwert / niedrigste Kosten). Es erzeugt lokale Optima als Lösungen. Hill Climbing findet keine (globale) Lösung, wenn: 1. der Zustandsraum lokale Maxima enthält, in denen der Algorithmus stecken bleibt, 2. Plateaus oder Ridges existieren, bei denen kein Fortschritt möglich ist."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Reinforcement learning ist eine Mischung aus Unsupervised und Supervised learning.",
    "type": "tf",
    "answer": false,
    "explanation": "Reinforcement Learning (Bestärkendes Lernen) ist ein völlig eigenes Paradigma, das auf Belohnungssignalen (Rewards) basiert, anstatt auf Labels oder reiner Strukturerkennung."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Die Induktive Lernmethode versucht mit einem Trainingsset eine Funktion h zu finden, welche die echte Funktion f approximiert (h ≈ f).",
    "type": "tf",
    "answer": true,
    "explanation": "Dies ist die Definition von Hypothesis Generation beim Inductive Learning."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Entscheidungsbäume sind ein Beispiel für Supervised learning.",
    "type": "tf",
    "answer": true,
    "explanation": "Decision Trees benötigen Trainingsdaten mit vorgegebenen Zielvariablen (Labels)."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Entscheidungsbäume können jede beliebige Funktion aus den Eingabeattributen darstellen.",
    "type": "tf",
    "answer": true,
    "explanation": "Entscheidungsbäume können prinzipiell jede beliebige Funktion der Eingabeattribute ausdrücken. Am Beispiel von booleschen Funktionen entspricht dabei jede Zeile einer Wahrheitstabelle exakt einem Pfad von der Wurzel bis zu einem Blattknoten. Generell existiert für jedes beliebige Trainingsset ein trivialer konsistenter Entscheidungsbaum, bei dem jedes Beispiel einen eigenen Pfad zu einem Blatt erhält. Auch wenn sie jede Funktion darstellen können, ist dies jedoch nicht immer die effizienteste oder kompakteste Repräsentationsform."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Induktives Lernen ist die Erweiterung von mathematischen Induktionsbeweisen auf allgemeine Daten.",
    "type": "tf",
    "answer": false,
    "explanation": "Mathematische Induktion ist strikt deduktiv (deductive). Induktives Lernen zieht verallgemeinernde Schlüsse aus Einzelbeispielen, was Fehler zulässt."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Der Problemgenerator eines lernenden Agenten erkennt, wenn sich der Agent in einer Problemsituation befindet.",
    "type": "tf",
    "answer": false,
    "explanation": "Der Problem Generator ist dafür zuständig, Aktionen vorzuschlagen, die den Agenten in neue, informative Situationen bringen (Exploration), anstatt passiv Probleme zu \"erkennen\"."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Beim unüberwachten Lernen werden Belohnungen und Bestrafungen verwendet.",
    "type": "tf",
    "answer": false,
    "explanation": "Das beschreibt Reinforcement Learning. Unsupervised Learning sucht lediglich nach Mustern (Clustering) in ungelabelten Daten."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Inductive learning kann nicht zur Klassifizierung verwendet werden.",
    "type": "tf",
    "answer": false,
    "explanation": "Induktives Lernen wird primär für Klassifikationsaufgaben (Classification) eingesetzt."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "In Reinforcement Learning werden Belohnungen und Bestrafungen verwendet.",
    "type": "tf",
    "answer": true,
    "explanation": "Ein RL-Agent lernt durch Reward und Punishment (Rewards)."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Erklären Sie das Konzept eines lernenden Agenten und beschreiben Sie dessen Komponenten.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Ein lernender Agent (learning agent) passt sein Verhalten basierend auf Erfahrungen an. Er besteht aus vier Komponenten: 1. Performance Element (wählt Aktionen), 2. Learning Element (nimmt Feedback auf und modifiziert das Performance Element), 3. Critic (bewertet die Agenten-Performance anhand eines externen Standards) und 4. Problem Generator (schlägt explorative, suboptimale Aktionen vor, um Neues zu lernen)."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Was versteht man unter einer Lernkurve? Nennen Sie Ursachen für unvorteilhafte Verläufe.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Eine Lernkurve (learning curve) visualisiert die Modell-Performance (z.B. Vorhersagegenauigkeit) auf der Y-Achse im Verhältnis zur Menge der bereitgestellten Trainingsdaten auf der X-Achse. Unvorteilhafte Verläufe entstehen durch Overfitting, qualitativ schlechte/verrauschte Daten (noise) oder ein ungeeignetes, zu starres Hypothesenmodell (underfitting)."
  },
  {
    "section": "06: Learning From Examples (I)",
    "question": "Erklären sie die Begriffe Overfitting und Decision Tree Pruning.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Overfitting (Überanpassung): Das Modell lernt die Trainingsdaten inklusive deren Rauschen auswendig, wodurch es bei neuen Testdaten schlecht generalisiert. Decision Tree Pruning: Eine Methode, um Overfitting bei Entscheidungsbäumen zu bekämpfen, indem statistisch bedeutungslose Knoten (branches) nach dem vollständigen Baumaufbau entfernt werden."
  },
  {
    "section": "07: Learning From Examples (II) Neural Networks",
    "question": "Multi-Layer Perzeptron Netzwerke sind für Bildverarbeitung maßgeschneidert",
    "type": "tf",
    "answer": false,
    "explanation": "Dafür sind Convolutional Neural Networks (CNNs) maßgeschneidert, da MLPs räumliche Translationen (spatial invariance) ignorieren."
  },
  {
    "section": "07: Learning From Examples (II) Neural Networks",
    "question": "Die logische Äquivalenz kann mit einem single-layer neuralen Netz realisiert werden.",
    "type": "tf",
    "answer": false,
    "explanation": "Logische Äquivalenz (XNOR) ist nicht linear separierbar und benötigt mindestens einen Hidden Layer."
  },
  {
    "section": "07: Learning From Examples (II) Neural Networks",
    "question": "Neuronale Netze sind generell schlecht in der Objekterkennung.",
    "type": "tf",
    "answer": false,
    "explanation": "Sie stellen den absoluten State-of-the-Art bei Objekterkennung (Object Recognition) dar."
  },
  {
    "section": "07: Learning From Examples (II) Neural Networks",
    "question": "Welche Rolle spielt die Aktivierungsfunktion in neuronalen Netzen?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Die Aktivierungsfunktion (activation function) bricht die Linearität im Netzwerk. Ohne sie wäre ein tiefes neuronales Netz mathematisch nur eine einzige lineare Transformation, unabhängig von der Anzahl der Schichten (layers). Sie ermöglicht das Lernen komplexer, nicht-linearer Muster."
  },
  {
    "section": "07: Learning From Examples (II) Neural Networks",
    "question": "Welche Funktionen können in Single- und Multi-Layer Perzeptronnetzwerken dargestellt werden?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Ein Single-Layer Perceptron (ohne Hidden units) kann ausschließlich linear separierbare Funktionen (linear separable functions) wie AND oder OR abbilden. Multi-Layer Perceptrons mit mindestens einer versteckten Schicht (hidden layer) und nicht-linearer Aktivierungsfunktion können jede beliebige kontinuierliche Funktion approximieren (z.B. XOR)."
  },
  {
    "section": "07: Learning From Examples (II) Neural Networks",
    "question": "Was versteht man unter Backpropagation?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Backpropagation ist der zentrale Lernalgorithmus für künstliche neuronale Netze. Der Fehler (Loss) zwischen Output und Zielwert wird rückwärts durch das Netzwerk propagiert. Unter Anwendung der Kettenregel (chain rule) der Differentialrechnung werden die Gradienten für jedes Gewicht berechnet, um diese mittels Gradientenabstieg (gradient descent) anzupassen."
  },
  {
    "section": "07: Learning From Examples (II) Neural Networks",
    "question": "Was versteht man unter Backpropagation? Wie lautet die Update-Regel für Gewichte im Netzinneren? Erläutern Sie die Symbole.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Backpropagation ist der Algorithmus zur Berechnung der Gradienten in einem künstlichen neuronalen Netz (artificial neural network), indem der Fehler rückwärts von der Ausgabeschicht durch die versteckten Schichten (hidden layers) propagiert wird. Die Update-Regel für den Gradientenabstieg (gradient descent) lautet: w_{ij} ← w_{ij} + α · a_i · Δ_j. Dabei ist α die Lernrate (learning rate), a_i die Aktivierung des vorherigen Neurons und Δ_j der Fehlerterm des aktuellen Neurons."
  },
  {
    "section": "07: Learning From Examples (II) Neural Networks",
    "question": "Betrachten Sie ein Perceptron mit zwei Eingängen x1, x2 und einem Ausgang y. Die Gewichte sind zu Beginn w1 = w2 = 0. Trainieren Sie das Perceptron mit der Perceptron Lernregel, der Aktivierungsfunktion g(x) = 2x und Lernrate α = 0,25 auf den Trainingsdaten f(1,0)=4, f(0,1)=-1, f(1,1)=3, um f(x1,x2) = 4·x1 − x2 zu lernen. Hat das Perceptron nach fünf Iterationen die Funktion gelernt?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Nein. Zunächst sind die Zielgewichte nicht w_1 = 4 und w_2 = -1. Da die Ausgabe ŷ = 2(w_1 x_1 + w_2 x_2) lautet, müssen die korrekten Zielgewichte w_1 = 2 und w_2 = -0,5 betragen, um die Funktion f(x_1, x_2) = 4x_1 - x_2 zu repräsentieren. Wendet man die angegebene Lernregel w_i ← w_i + α · (y - ŷ) · x_i an, liegen die Gewichte nach 5 Iterationen (Epochen) bei w_1 ≈ 1,961 und w_2 ≈ -0,461. Bei einer linearen Aktivierungsfunktion konvergieren die Gewichte asymptotisch gegen das Optimum, erreichen dieses aber nach 5 Iterationen noch nicht exakt."
  },
  {
    "section": "08: Learning From Examples (III) Deep Learning",
    "question": "Tiefe neuronale Netze werden gegenüber breiten neuronalen Netzen bevorzugt.",
    "type": "tf",
    "answer": true,
    "explanation": "Tiefe (deep) Architektur erlaubt das Erlernen hierarchischer Features mit insgesamt weniger Parametern als ein einzelner massiver Layer."
  },
  {
    "section": "08: Learning From Examples (III) Deep Learning",
    "question": "Ein Recurrent Neural Network hat keinen internen Zustand.",
    "type": "tf",
    "answer": false,
    "explanation": "Der interne Zustand (Hidden State, Memory) ist das definierende Hauptmerkmal von RNNs."
  },
  {
    "section": "08: Learning From Examples (III) Deep Learning",
    "question": "Bei Deep Learning ist es wichtig, dass große Datenmengen für das Training des neuronalen Netzwerkes zur Verfügung stehen.",
    "type": "tf",
    "answer": true,
    "explanation": "Deep Learning erfordert riesige Trainingsdatensätze, da enorm viele Gewichte optimiert werden müssen."
  },
  {
    "section": "08: Learning From Examples (III) Deep Learning",
    "question": "Für Deep Learning werden Netzwerke mit 3 bis maximal 10 hidden Layers verwendet.",
    "type": "tf",
    "answer": false,
    "explanation": "Moderne Architekturen (wie ResNet) verwenden dutzende bis hunderte Hidden Layers."
  },
  {
    "section": "08: Learning From Examples (III) Deep Learning",
    "question": "Boltzmann-Maschinen entsprechen zyklen-freien Neuronalen Netzwerken",
    "type": "tf",
    "answer": false,
    "explanation": "Boltzmann-Maschinen besitzen rekurrente, zyklische Verbindungen."
  },
  {
    "section": "08: Learning From Examples (III) Deep Learning",
    "question": "Was versteht man unter long short-term memory und wofür ist es besonders geeignet?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Long short-term memory (LSTM) ist eine spezielle Architektur eines Recurrent Neural Network (RNN). Durch den Einsatz von Speicherzellen (memory cells) und steuernden Gates (Input, Output, Forget) löst es das Problem des verschwindenden Gradienten (vanishing gradient). Es ist extrem gut geeignet für sequentielle Daten wie Text, Sprache oder Zeitreihen."
  },
  {
    "section": "08: Learning From Examples (III) Deep Learning",
    "question": "Was ist Deep Learning und was wird benötigt um es anwenden zu können? Erklären Sie welche Schwächen es hat.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Deep Learning verwendet neuronale Netze mit sehr vielen versteckten Schichten (deep neural networks), um Repräsentationen von Daten auf mehreren Abstraktionsebenen zu lernen. Es benötigt enorme Mengen an Trainingsdaten (large datasets) und hohe Rechenleistung (computational power, oft GPUs). Schwächen sind die mangelnde Erklärbarkeit (black-box model), der hohe Daten- und Energiebedarf sowie die Anfälligkeit für Overfitting und Adversarial Attacks."
  },
  {
    "section": "08: Learning From Examples (III) Deep Learning",
    "question": "Erklären Sie den Begriff Hopfield network.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Ein Hopfield-Netzwerk (Hopfield network) ist ein rekurrentes neuronales Netz (recurrent neural network), das als assoziativer Speicher (associative memory) fungiert. Alle Neuronen sind miteinander verbunden (vollständig verbunden, symmetrische Gewichte). Das Netz konvergiert zu stabilen Zuständen (Attraktoren), die den gespeicherten Mustern entsprechen. Es kann zur Mustervervollständigung und zur Lösung von Optimierungsproblemen eingesetzt werden."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Ein CSP darf nur binäre Constraints enthalten.",
    "type": "tf",
    "answer": false,
    "explanation": "Constraints können n-när sein (z.B. Alldiff-Constraint für Sudoku)."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Kein Constraint Satisfaction Problem ist in polynomieller Zeit lösbar.",
    "type": "tf",
    "answer": false,
    "explanation": "Baumstrukturierte CSPs (tree-structured CSPs) lassen sich sicher in polynomieller Zeit lösen."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Das Problem zu entscheiden ob ein Boole'sches CSP eine Lösung besitzt ist NP-hart.",
    "type": "tf",
    "answer": true,
    "explanation": "Dies entspricht exakt dem SAT-Problem."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Lineare Constraints können mithilfe von linearen Programmiermethoden in polynomialer Zeit gelöst werden.",
    "type": "tf",
    "answer": true,
    "explanation": "Lineare Programmierung (Linear Programming) bei reellen Variablen läuft in Polynomzeit."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Jeder Standard-Suchalgorithmus kann verwendet werden, um CSPs zu lösen.",
    "type": "tf",
    "answer": true,
    "explanation": "DFS oder BFS können angewendet werden (sind jedoch sehr ineffizient verglichen mit CSP-spezifischen Backtracking-Strategien)."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Die Aufgabe festzustellen ob ein CSP mit nichtlinearen Constraints eine Losung besitzt ist ein entscheidbares Problem.",
    "type": "tf",
    "answer": false,
    "explanation": "Bei ganzzahligen (Diophantische Gleichungen) oder beliebigen nichtlinearen Constraints ist das Problem allgemein unentscheidbar (undecidable)."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Jede konsistente Belegung von Werten einer Menge von Variablen in einem CSP ist eine Lösung für dieses CSP.",
    "type": "tf",
    "answer": false,
    "explanation": "Es muss eine *vollständige* (complete) und konsistente Belegung aller Variablen sein."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "CSPs mit nicht-linearen Constraints sind immer entscheidbar.",
    "type": "tf",
    "answer": false,
    "explanation": "Siehe oben."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Für ein CSP mit n Variablen mit jeweils d möglichen Werten gibt es maximal O(d^n) mögliche vollständige Zuordnungen.",
    "type": "tf",
    "answer": true,
    "explanation": "Dies ist die mathematische Größe des Zustandsraums (state space)."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Durch die Lockerung der Constraints eines Problems kann man zulässige Heuristiken erhalten.",
    "type": "tf",
    "answer": true,
    "explanation": "Relaxed Problems liefern stets admissible (zulässige) Heuristiken."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Alle Varianten von Constraint-Satisfaction Problemen sind entscheidbar.",
    "type": "tf",
    "answer": false,
    "explanation": "Insbesondere unendliche CSPs mit komplexen Constraints können unentscheidbar sein."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Ein CSP darf unendlich viele Variablen enthalten.",
    "type": "tf",
    "answer": false,
    "explanation": "In der Definition von CSPs wird eine endliche Menge von Variablen vorausgesetzt."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Lokale Suchalgorithmen können beim Lösen von CSPs hilfreich sein.",
    "type": "tf",
    "answer": true,
    "explanation": "Algorithmen wie Min-Conflicts sind für CSPs extrem performant."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Boole'sche CSPs sind NP-hart.",
    "type": "tf",
    "answer": true,
    "explanation": ""
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Definieren Sie die Begriffe einer vollständigen Zuordnung, einer konsistenten Zuordnung und einer Lösung.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Complete assignment (Vollständige Zuordnung): Jeder Variable des CSP wurde ein Wert zugewiesen. Consistent assignment (Konsistente Zuordnung): Keine Constraint-Bedingungen werden durch die aktuellen Zuweisungen verletzt. Solution (Lösung): Eine Zuordnung, die gleichzeitig komplett und konsistent ist."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Erkären Sie Backtracking Search für CSP. Warum ist sie im Allgemeinen nicht besonders effizient?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Backtracking Search ist eine uninformierte Tiefensuche, die Variablen nacheinander Werte zuweist und bei der ersten Constraint-Verletzung zurückspringt (backtracking) [1-3]. Sie ist ineffizient, weil sie in ihrer Grundform als uninformierter Algorithmus keine Heuristiken (wie zur Reihenfolge der Variablenzuweisung) nutzt und Fehler oft erst tief im Suchbaum bemerkt, da Methoden wie Forward Checking fehlen [4, 5]."
  },
  {
    "section": "09: Constraint Satisfaction Problems",
    "question": "Definieren Sie den Begriff einer vollständigen Zuordnung (complete assignment) und einer Lösung (solution) im Kontext von Constraint Satisfaction Problemen.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Complete assignment (Vollständige Zuordnung): Jeder Variable des CSP wurde ein Wert aus ihrer Domäne zugewiesen. Solution (Lösung): Eine vollständige Zuordnung, bei der keine Constraint-Bedingung verletzt wird (d.h. sie ist gleichzeitig komplett und konsistent)."
  },
  {
    "section": "11: Planning",
    "question": "Klassische Planungsumgebungen sind deterministisch.",
    "type": "tf",
    "answer": true,
    "explanation": "Aktionen schlagen nicht fehl und haben eindeutige Effekte."
  },
  {
    "section": "11: Planning",
    "question": "Im Gegensatz zu STRIPS unterstützt ADL Gleichheit.",
    "type": "tf",
    "answer": true,
    "explanation": "ADL erlaubt komplexe Bedingungen inklusive Gleichheitsprüfungen."
  },
  {
    "section": "11: Planning",
    "question": "Ein Partial-Order Plan entsteht durch Linearisierung eines Total-Order Plans.",
    "type": "tf",
    "answer": false,
    "explanation": "Es ist genau umgekehrt. Ein linearer, total-geordneter Plan (Total-Order) entsteht durch das Auflösen (Linearisieren) einer Teilordnung (Partial-Order)."
  },
  {
    "section": "11: Planning",
    "question": "Literale in STRIPS sind grundiert und dürfen Funktionen enthalten.",
    "type": "tf",
    "answer": false,
    "explanation": "STRIPS vermeidet Funktionensymbole, um sicherzustellen, dass die Menge der Grundterme (ground literals) endlich bleibt."
  },
  {
    "section": "11: Planning",
    "question": "Klassische Planungsumgebungen sind nicht vollständig beobachtbar.",
    "type": "tf",
    "answer": false,
    "explanation": "Klassische Planung geht von vollständiger Beobachtbarkeit (full observability) aus."
  },
  {
    "section": "11: Planning",
    "question": "Beim POP-Algorithmus ist die Relation fur den initialen Plan leer.",
    "type": "tf",
    "answer": false,
    "explanation": "Sie enthält von Anfang an die Ordnungsrelation 'Start ≺ Finish'."
  },
  {
    "section": "11: Planning",
    "question": "Die Action Description Language (ADL) erlaubt nur postive literale in States.",
    "type": "tf",
    "answer": false,
    "explanation": "ADL lässt explizit negative Literale (negative literals) in Zuständen zu."
  },
  {
    "section": "11: Planning",
    "question": "Kommt in ADL ein Literal in einem Zustand nicht vor, so wird dieses als falsch angenommen.",
    "type": "tf",
    "answer": false,
    "explanation": "ADL arbeitet mit der Open-World Assumption (OWA). Nicht Erwähntes gilt als unbekannt. STRIPS nutzt die Closed-World Assumption."
  },
  {
    "section": "11: Planning",
    "question": "Der POP-Algorithmus erzeugt nur konsistente Pläne.",
    "type": "tf",
    "answer": true,
    "explanation": "Der Algorithmus prüft Konflikte und fügt bei Bedarf neue Ordnungsrelationen hinzu, um Konsistenz zu gewährleisten."
  },
  {
    "section": "11: Planning",
    "question": "In STRIPS wird angenommen, dass im Effekt nicht erwähnte Literale unverändert bleiben.",
    "type": "tf",
    "answer": true,
    "explanation": "STRIPS löst so das Frame-Problem."
  },
  {
    "section": "11: Planning",
    "question": "Ziele in ADL dürfen Disjunktionen enthalten.",
    "type": "tf",
    "answer": true,
    "explanation": "ADL erlaubt komplexe Zielformulierungen inklusive Disjunktionen (OR)."
  },
  {
    "section": "11: Planning",
    "question": "Die Aussage \"wenn ein Flugzeug fliegt, bewegen sich alle seine Insassen entsprechend den Bewegungen des Flugzeuges\" ist ein Beispiel für das Ramifikationsproblem.",
    "type": "tf",
    "answer": true,
    "explanation": "Es illustriert die Herausforderung indirekter Konsequenzen (Ramifications) einer Aktion."
  },
  {
    "section": "11: Planning",
    "question": "In STRIPS gilt die Open-World Assumption.",
    "type": "tf",
    "answer": false,
    "explanation": "STRIPS verwendet die Closed-World Assumption (alles nicht definierte ist falsch)."
  },
  {
    "section": "11: Planning",
    "question": "Die Aussage \"wenn ein Auto vorwärts fährt, ändert sich seine Farbe nicht\" ist ein Beispiel welches das Frame Problem illustriert.",
    "type": "tf",
    "answer": true,
    "explanation": "Das Frame-Problem beschreibt das Problem, spezifizieren zu müssen, was sich *nicht* ändert."
  },
  {
    "section": "11: Planning",
    "question": "Ziele in ADL dürfen Quantoren enthalten.",
    "type": "tf",
    "answer": true,
    "explanation": "Existenz- und Allquantoren sind in ADL erlaubt."
  },
  {
    "section": "11: Planning",
    "question": "∀y Loves(y, susie) ist ein syntaktisch korrektes Ziel in STRIPS.",
    "type": "tf",
    "answer": false,
    "explanation": "Universelle Quantifizierungen (Allquantor) sind in klassischen STRIPS-Zielen nicht erlaubt."
  },
  {
    "section": "11: Planning",
    "question": "In ADL können Variablen Typen haben.",
    "type": "tf",
    "answer": true,
    "explanation": "Typed variables sind ein Kernfeature von ADL."
  },
  {
    "section": "11: Planning",
    "question": "In Partial Order Planning gilt für alle Aktionen A, B, dass höchstens eine der Bedingungen A ≺ B oder B ≺ A zutrifft.",
    "type": "tf",
    "answer": true,
    "explanation": "Ein Plan muss zyklenfrei bleiben, weshalb die Relationen asymmetrisch sind."
  },
  {
    "section": "11: Planning",
    "question": "Planen kann auf das Satisfiability Problem reduziert werden.",
    "type": "tf",
    "answer": true,
    "explanation": "Algorithmen wie SATPlan machen genau das."
  },
  {
    "section": "11: Planning",
    "question": "x Has(jim, car) V Has(jim, dog) ist ein syntaktisch korrektes Ziel in STRIPS.",
    "type": "tf",
    "answer": false,
    "explanation": "Disjunktionen (V) sind in STRIPS nicht gestattet."
  },
  {
    "section": "11: Planning",
    "question": "ADL lässt sowohl positive als auch negative Literale in Zuständen zu.",
    "type": "tf",
    "answer": true,
    "explanation": ""
  },
  {
    "section": "11: Planning",
    "question": "In STRIPS gilt die Closed-World Assumption.",
    "type": "tf",
    "answer": true,
    "explanation": ""
  },
  {
    "section": "11: Planning",
    "question": "Klassische Planungsumgebungen sind statisch.",
    "type": "tf",
    "answer": true,
    "explanation": ""
  },
  {
    "section": "11: Planning",
    "question": "Meets(x, bob) ist ein syntaktisch korrektes Ziel in STRIPS.",
    "type": "tf",
    "answer": false,
    "explanation": "Klassische STRIPS-Ziele müssen voll grundiert sein (dürfen keine freien Variablen wie x beinhalten)."
  },
  {
    "section": "11: Planning",
    "question": "In Partial Order Planning besagt der Constraint A ≺ B, dass A unmittelbar vor B ausgeführt werden muss.",
    "type": "tf",
    "answer": false,
    "explanation": "A ≺ B bedeutet nur \"irgendwann vor B\", nicht gezwungenermaßen unmittelbar davor."
  },
  {
    "section": "11: Planning",
    "question": "Welche drei Probleme gibt es beim Planen bezüglich dem Schlussfolgern über Handlungen?",
    "type": "flashcard",
    "answer": null,
    "explanation": "1. Frame-Problem: Die Schwierigkeit kompakt zu repräsentieren, welche Dinge sich durch eine Aktion *nicht* verändern. 2. Qualification-Problem: Es ist praktisch unmöglich, alle Vorbedingungen (preconditions) aufzulisten, die nötig sind, damit eine Aktion gelingt. 3. Ramification-Problem: Die Herausforderung, alle (impliziten) Nebeneffekte einer Aktion zu modellieren."
  },
  {
    "section": "11: Planning",
    "question": "Wann spricht man beim Partial-Order Planning von einem Konflikt?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Ein Konflikt (Threat) entsteht in partiell geordneten Plänen, wenn eine Aktion C den Effekt hat, die Vorbedingung p eines kausalen Links (causal link) A → B aufzuheben (zu negieren), und die Aktion C zeitlich zwischen A und B ausgeführt werden könnte."
  },
  {
    "section": "11: Planning",
    "question": "Beschreiben Sie zwei Methoden des Planens mittels State-Space Search.",
    "type": "flashcard",
    "answer": null,
    "explanation": "1. Forward Search (Vorwärtssuche / Progression): Startet vom Anfangszustand und wendet Aktionen an, bis der Zielzustand erreicht ist. Vorteil: einfach umsetzbar. Nachteil: kann sehr großen Suchraum erzeugen. 2. Backward Search (Rückwärtssuche / Regression): Startet vom Zielzustand und ermittelt rückwärts, welche Aktionen dazu geführt haben könnten. Vorteil: oft effizienter, da nur zielrelevante Aktionen betrachtet werden."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Das Axiom der Stetigkeit lautet: A > B > C ⇒ ∃ p[p,A; 1-p,B] ~ C.",
    "type": "tf",
    "answer": false,
    "explanation": "Die Formel im Angabentext ist inkorrekt gesetzt. Korrekt lautet das Stetigkeitsaxiom (Continuity Axiom): Wenn A > B > C, dann existiert ein p, sodass B ~ [p, A; 1-p, C] (eine Lotterie zwischen dem Besten und dem Schlechtesten entspricht dem Mittleren)."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Das Verhalten eines Agenten ändert sich nach einer affinen Transformation seiner Nutzenfunktion nicht.",
    "type": "tf",
    "answer": true,
    "explanation": "Nutzenfunktionen sind invariant gegenüber streng monoton steigenden linearen Transformationen (affine transformations)."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Der Wert perfekter Information ist nicht additiv, d.h. im Allgemeinen gilt VPI_e(E_j,E_k) ≠ VPI_e(E_j) + VPI_e(E_k).",
    "type": "tf",
    "answer": true,
    "explanation": "Da Informationen überlappen können, ist VPI (Value of Perfect Information) generell nicht additiv."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Die Formel des erwarteten Nutzens EU(a|e) lautet Σ_s' P(RESULT(a)=s'|a,e) + U(s').",
    "type": "tf",
    "answer": false,
    "explanation": "In der Formel des Angabentextes steht ein Plus (+). Wahrscheinlichkeit und Nutzen müssen multipliziert werden (P * U)."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Die Expected Utility, EU(a|e), einer gegebenen Aktion a unter Evidenz e ist gegeben durch EU(a|e) = ∏_s' P(RESULT(a)=s'|a,e) U(s').",
    "type": "tf",
    "answer": false,
    "explanation": "Die Expected Utility verwendet die Summe (Σ, Summenzeichen) und nicht das Produkt (∏) über alle Zustände."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Die Axiome der Nutzentheorie implizieren die Existenz einer reellwertigen Nutzenfunktion.",
    "type": "tf",
    "answer": true,
    "explanation": "Nach dem Theorem von von Neumann-Morgenstern existiert eine reelle Nutzenfunktion, falls die Axiome eingehalten werden."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Der Wert der perfekten Information (VPI) ist immer positiv.",
    "type": "tf",
    "answer": false,
    "explanation": "Er ist nicht-negativ (≥ 0). Er kann exakt 0 sein, falls die neue Information die eigentliche Handlungsentscheidung nicht verändert."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Definieren Sie den Begriff einer Lotterie in der Entscheidungstheorie.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Eine Lotterie (lottery) ist ein probabilistisches Modell, das mögliche Ergebnisse mit den zugehörigen Wahrscheinlichkeiten ihres Eintretens verknüpft. Formal geschrieben als L = [p_1, A; p_2, B; ...; p_n, Z], wobei die Summe aller Wahrscheinlichkeiten p_i genau 1 ergibt."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Was versteht man unter certainty equivalent in der Nutzentheorie?",
    "type": "flashcard",
    "answer": null,
    "explanation": "Das Certainty equivalent (Sicherheitsäquivalent) ist der garantierte Auszahlungswert, bei dem ein Agent indifferent ist zwischen dem Erhalt dieser sicheren Auszahlung und der Teilnahme an einer gegebenen Lotterie (mit Risiko). Der Unterschied zwischen Erwartungswert und Certainty equivalent ist die Risikoprämie."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Geben Sie die Definition des Axioms der Monotonie mittels Angabe der entsprechenden Formel.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Das Axiom der Monotonie (axiom of monotonicity) besagt, dass bei zwei Lotterien mit denselben zwei möglichen Ausgängen (einem sehr guten A und einem schlechten B) ein rationaler Agent (rational agent) immer diejenige Lotterie bevorzugt, die eine höhere Wahrscheinlichkeit p für das bessere Ergebnis A bietet. Formal: (A ≻ B) ⇒ ((p, A; 1-p, B) ≻ (q, A; 1-q, B) ⇔ p > q)."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Erklären Sie, welche Knotenarten es in Decision Networks gibt und wozu diese verwendet werden.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Entscheidungsnetzwerke (decision networks) haben drei Knotenarten: 1. Chance Nodes (Zufallsknoten, Ovale): Repräsentieren Zufallsvariablen und Unsicherheiten (wie in Bayes'schen Netzen). 2. Decision Nodes (Entscheidungsknoten, Rechtecke): Repräsentieren die Aktionen, die der Agent wählen kann. 3. Utility Nodes (Nutzenknoten, Rauten): Berechnen den erwarteten Nutzen (expected utility) basierend auf den Zuständen der Elternknoten."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Geben Sie die Definition des Begriffes einer Lotterie in der Entscheidungstheorie sowie des Axioms der Ersetzbarkeit (Substitutability).",
    "type": "flashcard",
    "answer": null,
    "explanation": "Lotterie: Ein probabilistisches Konstrukt L = [p_1, A_1; p_2, A_2; ...; p_n, A_n], das Ergebnisse mit Wahrscheinlichkeiten verknüpft (∑ p_i = 1). Axiom der Ersetzbarkeit (Substitutability): Wenn ein Agent zwischen zwei Ergebnissen A und B indifferent ist (A ∼ B), dann ist er auch indifferent zwischen jeder Lotterie, die A enthält, und derselben Lotterie, in der A durch B ersetzt wurde."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Geben Sie die Formel für das Axiom der Stetigkeit (Continuity) aus der Nutzentheorie an.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Das Axiom der Stetigkeit (axiom of continuity) besagt: Wenn A ≻ B ≻ C, dann existiert eine Wahrscheinlichkeit p ∈ [0,1], sodass der Agent indifferent ist zwischen dem sicheren Ergebnis B und der Lotterie [p, A; 1-p, C]. Formal: A ≻ B ≻ C ⇒ ∃ p: B ∼ [p, A; (1-p), C]."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Definieren Sie durch Angabe der Formel die Axiome der Substituierbarkeit (Substitutability) sowie der Dekomponierbarkeit (Decomposability) der Nutzentheorie.",
    "type": "flashcard",
    "answer": null,
    "explanation": "Substituierbarkeit (Substitutability): A ∼ B ⇒ [p, A; 1-p, C] ∼ [p, B; 1-p, C]. Das heißt, äquivalente Ergebnisse können in Lotterien gegeneinander ausgetauscht werden. Dekomponierbarkeit (Decomposability / No fun in gambling): [p, A; 1-p, [q, B; 1-q, C]] ∼ [p, A; (1-p)q, B; (1-p)(1-q), C]. Das heißt, verschachtelte Lotterien können ohne Informationsverlust in eine einfache Lotterie umgewandelt werden."
  },
  {
    "section": "12: Making Simple Decisions 1",
    "question": "Beschreiben Sie drei Eigenschaften des Value of Perfect Information (VPI) mittels Angabe der entsprechenden Formeln.",
    "type": "flashcard",
    "answer": null,
    "explanation": "1. Nicht-Negativität: VPI(E_j) ≥ 0 – perfekte Information kann den erwarteten Nutzen nie verringern. 2. Nicht-Additivität: VPI(E_j, E_k) ≠ VPI(E_j) + VPI(E_k) im Allgemeinen – der Gesamtwert mehrerer Informationen ist nicht die Summe der Einzelwerte (Informationen können redundant sein). 3. Reihenfolgeunabhängigkeit: VPI(E_j | E_k) = VPI(E_j, E_k) - VPI(E_k) – der Wert einer Information ändert sich abhängig davon, welche anderen Informationen bereits bekannt sind."
  },
  {
    "section": "14: Philosophical Foundations of AI",
    "question": "In der schwachen AI-Hypothese wird angenommen, dass AI-Systeme Bewusstsein haben können.",
    "type": "tf",
    "answer": false,
    "explanation": "Das ist die starke KI-Hypothese (Strong AI). Die schwache KI (Weak AI) besagt nur, dass Maschinen *so handeln* können, als wären sie intelligent, ohne echtes Bewusstsein (consciousness) zu besitzen."
  }
];