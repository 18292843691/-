(() => {
  // *************** 实现 fiber **************** //
  const TEXT_ELEMENT = "TEXT_ELEMENT";

  const createElement = (type, props, ...children) => {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => {
          return typeof child === "object" ? child : createTextElement(child);
        }),
      },
    };
  };

  const createTextElement = (text) => {
    return {
      type: TEXT_ELEMENT,
      props: {
        nodeValue: text,
        children: [],
      },
    };
  };

  const React = {
    createElement,
  };

  const createDom = (fiber) => {
    const dom =
      fiber.type === TEXT_ELEMENT
        ? document.createTextNode("")
        : document.createElement(fiber.type);

    const isProperty = (key) => key !== "children";

    Object.keys(fiber.props)
      .filter(isProperty)
      .map((name) => {
        dom[name] = fiber.props[name];
      });

    // filter.props.children.map(child => render(child, dom))
    // container.appendChild(dom)
    return dom;
  };

  const commitRoot = () => {
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
  };

  const commitWork = (fiber) => {
    if (!fiber) {
      return;
    }
    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  };

  const render = (element, container) => {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
      alternate: currentRoot,
    };

    nextUnitOfWork = wipRoot;
  };

  const ReactDOM = {
    render,
  };

  let nextUnitOfWork = null;
  let wipRoot = null;
  let currentRoot = null;

  const workLoop = (deadline) => {
    let showYield = false;

    while (nextUnitOfWork && !showYield) {
      // console.log('nextUnitOfWork', nextUnitOfWork, showYield)
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      showYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
      console.log("wipRoot", wipRoot);
      commitRoot();
    }

    window.requestIdleCallback(workLoop);
  };

  requestIdleCallback(workLoop);

  const performUnitOfWork = (fiber) => {
    console.log("performUnitOfWork", fiber);
    // add dom node
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }

    if (fiber.parent) {
      fiber.parent.dom.appendChild(fiber.dom);
    }

    // create new fibers
    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);

    // return next unit of work
    if (fiber.child) {
      return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  };

  const reconcileChildren = (wipFiber, elements) => {
    let index = 0;
    let preSibling = null;

    while (index < elements.length) {
      const ele = elements[index];
      // TODO compare oldFiber to element
      const newFiber = {
        type: ele.type,
        props: ele.props,
        parent: wipFiber,
        dom: null,
      };

      if (index === 0) {
        wipFiber.child = newFiber;
      } else {
        preSibling.sibling = newFiber;
      }

      preSibling = newFiber;
      index++;
    }
  };

  // ******************************* //
  // 1. const element = <h1 title="foo">Hello</h1>

  // 2. const element = React.createElement(
  //   "h1",
  //   { title: "foo" },
  //   "Hello"
  // )

  // 3. const element = {
  //   type: "h1",
  //   props: {
  //     title: "foo",
  //     children: "Hello",
  //   },
  // }

  const element = React.createElement(
    "div",
    {
      id: "foo",
    },
    React.createElement("a", { id: "a" }, "aaa"),
    React.createElement("span", { id: "span" }, "span")
  );

  // console.log('element', element)

  const container = document.getElementById("root");
  ReactDOM.render(element, container);
})();
