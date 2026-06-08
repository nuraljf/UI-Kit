import { Stage } from "@/components/glass/Stage";
import { Button, IconButton } from "@/components/ui/Button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { Segmented } from "@/components/ui/Segmented";
import { ActionsCard } from "@/components/ui/ActionsCard";
import { GhostCircle } from "@/components/ui/GhostCircle";

/** Absolutely position a node at its exact Figma (left, top) in the 1440×1024 frame. */
function Pos({
  l,
  t,
  children,
}: {
  l: number;
  t: number;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute" style={{ left: l, top: t }}>
      {children}
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <Stage>
        {/* Row 1 — rectangle buttons (radius 16) */}
        <Pos l={43} t={41}>
          <Button variant="light">Button</Button>
        </Pos>
        <Pos l={158} t={41}>
          <Button variant="dark">Button</Button>
        </Pos>
        <Pos l={273} t={41}>
          <Button variant="subtle">Button</Button>
        </Pos>
        <Pos l={388} t={42}>
          <IconButton variant="light" label="Add" />
        </Pos>
        <Pos l={465} t={42}>
          <IconButton variant="dark" label="Add" />
        </Pos>
        <Pos l={562} t={46}>
          <Button variant="light" size="sm">
            Button
          </Button>
        </Pos>

        {/* Row 2 — pill buttons (radius 34) */}
        <Pos l={43} t={124}>
          <Button variant="light" pill>
            Button
          </Button>
        </Pos>
        <Pos l={158} t={124}>
          <Button variant="dark" pill>
            Button
          </Button>
        </Pos>
        <Pos l={273} t={124}>
          <Button variant="subtle" pill>
            Button
          </Button>
        </Pos>
        <Pos l={388} t={125}>
          <IconButton variant="light" pill label="Add" />
        </Pos>
        <Pos l={465} t={127}>
          <IconButton variant="dark" pill label="Add" />
        </Pos>

        {/* Row 3 — button groups with dropdown */}
        <Pos l={43} t={207}>
          <ButtonGroup variant="light" />
        </Pos>
        <Pos l={247} t={207}>
          <ButtonGroup variant="dark" />
        </Pos>

        {/* Row 4 — actions cards */}
        <Pos l={43} t={290}>
          <ActionsCard variant="light" />
        </Pos>
        <Pos l={216} t={290}>
          <ActionsCard variant="dark-strong" />
        </Pos>

        {/* Center — ghost circle (draggable + resizable lens) */}
        <GhostCircle initialX={748} initialY={284} />

        {/* Row 5 — segmented controls */}
        <Pos l={43} t={439}>
          <Segmented size="md" />
        </Pos>
        <Pos l={266} t={445}>
          <Segmented size="sm" />
        </Pos>
      </Stage>
    </main>
  );
}
